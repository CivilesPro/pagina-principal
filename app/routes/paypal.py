"""FastAPI routes to manage the PayPal checkout flow."""

from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .. import catalog
from ..database import get_session
from ..models import DownloadToken, Purchase
from ..paypal_client import PayPalError, capture_order as paypal_capture_order, create_order as paypal_create_order

router = APIRouter(prefix="/api/paypal", tags=["paypal"])

logger = logging.getLogger(__name__)

DOWNLOAD_TOKEN_TTL_HOURS = int(os.environ.get("DOWNLOAD_TOKEN_TTL_HOURS", "24"))
BACKEND_BASE_URL = os.environ.get("BACKEND_BASE_URL")

SUPPORTED_PAYPAL = {"USD"}


def normalize_for_paypal(currency: str) -> str:
    cur = (currency or "USD").upper()
    return cur if cur in SUPPORTED_PAYPAL else "USD"


class CreateOrderRequest(BaseModel):
    slug: str = Field(..., description="Identificador del producto")
    currency: str = Field(..., min_length=3, max_length=3)


class CreateOrderResponse(BaseModel):
    orderID: str


class CaptureOrderRequest(BaseModel):
    orderID: str = Field(..., min_length=3)


class CaptureOrderResponse(BaseModel):
    downloadUrl: str


def _finalize_purchase(
    purchase: Purchase,
    db: Session,
    now: datetime,
    order_id: str,
    payer_email: Optional[str],
) -> CaptureOrderResponse | JSONResponse:
    existing_token = (
        db.query(DownloadToken)
        .filter(DownloadToken.order_id == order_id)
        .order_by(DownloadToken.created_at.desc())
        .first()
    )

    if existing_token and existing_token.expires_at > now:
        needs_commit = False
        if purchase.status != "COMPLETED":
            purchase.status = "COMPLETED"
            needs_commit = True
        if payer_email and purchase.payer_email != payer_email:
            purchase.payer_email = payer_email
            needs_commit = True

        if needs_commit:
            db.add(purchase)
            try:
                db.commit()
            except Exception:
                db.rollback()
                logger.exception("Database error while finalizing order '%s'", order_id)
                return _json_error(500, "No se pudo finalizar la orden.")

        logger.info(
            "Existing download token reused for order '%s' (token id '%s')",
            order_id,
            existing_token.id,
        )
        return CaptureOrderResponse(downloadUrl=_build_download_url(existing_token.id))

    product = catalog.get_product(purchase.slug)
    if not product or not product.file_key:
        db.rollback()
        logger.error(
            "Product '%s' is missing file key during capture for order '%s'",
            purchase.slug,
            order_id,
        )
        return _json_error(500, "Producto sin archivo configurado")

    expires_at = now + timedelta(hours=DOWNLOAD_TOKEN_TTL_HOURS)
    token_id = str(uuid4())

    purchase.status = "COMPLETED"
    if payer_email:
        purchase.payer_email = payer_email

    token = DownloadToken(
        id=token_id,
        slug=purchase.slug,
        file_key=product.file_key,
        order_id=order_id,
        payer_email=purchase.payer_email,
        expires_at=expires_at,
    )

    db.add(purchase)
    db.add(token)

    try:
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Database error while finalizing order '%s'", order_id)
        return _json_error(500, "No se pudo finalizar la orden.")

    logger.info(
        "Order '%s' captured successfully. Download token '%s' generated with expiration %s",
        order_id,
        token_id,
        expires_at.isoformat(),
    )
    return CaptureOrderResponse(downloadUrl=_build_download_url(token.id))


def _amount_to_string(value: Decimal) -> str:
    return f"{value:.2f}"


def _build_download_url(token_id: str) -> str:
    if BACKEND_BASE_URL:
        return f"{BACKEND_BASE_URL.rstrip('/')}/api/download/{token_id}"
    return f"/api/download/{token_id}"


def _json_error(status_code: int, message: str) -> JSONResponse:
    logger.warning("Responding with error %s: %s", status_code, message)
    return JSONResponse(status_code=status_code, content={"message": message})


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order_endpoint(payload: CreateOrderRequest, db: Session = Depends(get_session)) -> CreateOrderResponse | JSONResponse:
    currency = payload.currency.upper()
    logger.info("Create order requested for slug='%s' with currency='%s'", payload.slug, currency)
    try:
        currency = catalog.normalize_currency(currency)
    except ValueError as exc:  # pragma: no cover - validation
        logger.warning("Invalid currency provided for slug='%s': %s", payload.slug, exc)
        return _json_error(400, str(exc))

    product = catalog.get_product(payload.slug)
    if not product:
        logger.warning("Product not found for slug='%s'", payload.slug)
        return _json_error(404, "Producto no encontrado")

    if product.price_cop is None or not product.file_key:
        logger.warning(
            "Product '%s' is not available for online purchase (price_cop=%s, file_key=%s)",
            payload.slug,
            product.price_cop,
            bool(product.file_key),
        )
        return _json_error(400, "Este producto no está disponible para compra en línea.")

    amount_ui = catalog.convert_from_cop(product.price_cop, currency)
    paypal_currency = normalize_for_paypal(currency)
    if paypal_currency != currency:
        amount_for_paypal = catalog.convert_to_usd(amount_ui, currency)
        logger.info(
            "Falling back currency %s -> %s, value=%s",
            currency,
            paypal_currency,
            _amount_to_string(amount_for_paypal),
        )
    else:
        amount_for_paypal = amount_ui

    logger.info(
        "Creating PayPal order for slug='%s' amount=%s %s (paypal=%s %s)",
        payload.slug,
        _amount_to_string(amount_ui),
        currency,
        _amount_to_string(amount_for_paypal),
        paypal_currency,
    )
    try:
        paypal_response = await paypal_create_order(
            amount_value=_amount_to_string(amount_for_paypal),
            currency_code=paypal_currency,
            description=f"CivilesPro - {product.title}",
            reference_id=product.slug,
        )
    except PayPalError as exc:
        logger.error("PayPal error while creating order for slug='%s': %s", payload.slug, exc)
        return _json_error(502, f"PayPal error: {exc}")
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Unexpected error while creating order for slug='%s'", payload.slug)
        return _json_error(500, f"Server error: {exc}")

    order_id = paypal_response.get("id")
    if not order_id:
        logger.error("PayPal response without order id for slug='%s': %s", payload.slug, paypal_response)
        return _json_error(502, "Respuesta inválida de PayPal")

    purchase = Purchase(
        slug=product.slug,
        title=product.title,
        order_id=order_id,
        amount=amount_ui,
        currency=currency,
        status="CREATED",
    )

    try:
        db.add(purchase)
        db.commit()
    except Exception:  # pragma: no cover - commit protection
        logger.exception("Database error while storing order '%s'", order_id)
        db.rollback()
        return _json_error(500, "No se pudo registrar la orden.")

    logger.info("PayPal order created successfully for slug='%s' with order id '%s'", payload.slug, order_id)
    return CreateOrderResponse(orderID=order_id)


@router.post("/capture-order", response_model=CaptureOrderResponse)
async def capture_order_endpoint(payload: CaptureOrderRequest, db: Session = Depends(get_session)) -> CaptureOrderResponse | JSONResponse:
    order_id = payload.orderID
    logger.info("Capture order requested for order id '%s'", order_id)
    purchase: Optional[Purchase] = db.query(Purchase).filter(Purchase.order_id == order_id).one_or_none()

    if not purchase:
        logger.warning("Capture attempted for unknown order id '%s'", order_id)
        return _json_error(404, "Orden no registrada")

    now = datetime.now(timezone.utc)

    if purchase.status == "COMPLETED":
        return _finalize_purchase(purchase, db, now, order_id, purchase.payer_email)

    try:
        response = await paypal_capture_order(order_id)
    except PayPalError as exc:
        logger.error("PayPal error while capturing order '%s': %s", order_id, exc)
        return _json_error(502, f"PayPal error: {exc}")
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Unexpected error while capturing order '%s'", order_id)
        return _json_error(500, f"Server error: {exc}")

    try:
        capture_data = response.json()
    except ValueError:
        capture_data = None

    if response.status_code >= 400:
        error_payload = capture_data if isinstance(capture_data, dict) else {}
        details = error_payload.get("details") if isinstance(error_payload, dict) else None

        def _has_issue(issue: str) -> bool:
            if not isinstance(details, list):
                return False
            return any(isinstance(item, dict) and item.get("issue") == issue for item in details)

        name = error_payload.get("name") if isinstance(error_payload, dict) else None
        issue_value = error_payload.get("issue") if isinstance(error_payload, dict) else None

        if (
            issue_value == "ORDER_ALREADY_CAPTURED"
            or (name == "UNPROCESSABLE_ENTITY" and _has_issue("ORDER_ALREADY_CAPTURED"))
            or _has_issue("ORDER_ALREADY_CAPTURED")
        ):
            logger.info("PayPal reported order '%s' already captured; reusing download link", order_id)
            return _finalize_purchase(purchase, db, now, order_id, purchase.payer_email)

        if (
            issue_value == "INSTRUMENT_DECLINED"
            or name == "INSTRUMENT_DECLINED"
            or _has_issue("INSTRUMENT_DECLINED")
        ):
            return _json_error(400, "Método de pago declinado. Intenta nuevamente.")

        message: Optional[str] = None
        if isinstance(error_payload, dict):
            message = error_payload.get("message")
            if not message and isinstance(details, list) and details:
                first_detail = details[0]
                if isinstance(first_detail, dict):
                    message = first_detail.get("description") or first_detail.get("issue")

        if not message:
            message = response.text or "Respuesta inválida de PayPal"

        message = str(message)

        logger.warning("PayPal capture error for order '%s': %s", order_id, message)
        return _json_error(400, f"PayPal error: {message}")

    if not isinstance(capture_data, dict):
        logger.error("PayPal capture response invalid for order '%s': %s", order_id, response.text)
        return _json_error(502, "Respuesta inválida de PayPal")

    status = capture_data.get("status")
    if status != "COMPLETED":
        logger.warning("Capture response for order '%s' not completed: %s", order_id, status)
        return _json_error(400, "La orden no fue completada.")

    purchase_units = capture_data.get("purchase_units") or []
    if not purchase_units:
        logger.error("PayPal capture response missing purchase units for order '%s': %s", order_id, capture_data)
        return _json_error(400, "Orden de PayPal inválida")

    first_unit = purchase_units[0]
    payments = first_unit.get("payments", {})
    captures = payments.get("captures") or []
    if not captures:
        logger.error("PayPal capture response missing captures for order '%s': %s", order_id, capture_data)
        return _json_error(400, "La orden no tiene capturas registradas")

    capture_entry = captures[0]
    if capture_entry.get("status") != "COMPLETED":
        logger.warning(
            "Capture entry for order '%s' is not completed: %s",
            order_id,
            capture_entry.get("status"),
        )
        return _json_error(400, "La captura no fue completada")

    capture_amount = capture_entry.get("amount", {})
    captured_value = capture_amount.get("value")
    captured_currency = capture_amount.get("currency_code")

    if not captured_value:
        logger.error("Capture amount invalid for order '%s': %s", order_id, capture_entry)
        return _json_error(400, "Monto de captura inválido")

    try:
        captured_decimal = Decimal(captured_value)
    except Exception:  # pragma: no cover - defensive
        logger.exception("Invalid capture amount format for order '%s': %s", order_id, capture_entry)
        return _json_error(400, "Monto de captura inválido")

    stored_currency = (purchase.currency or "").upper()
    capture_currency_code = (captured_currency or "").upper() if captured_currency else ""
    if capture_currency_code == stored_currency and stored_currency:
        stored_amount = Decimal(purchase.amount)
        if captured_decimal != stored_amount:
            logger.error(
                "Capture amount mismatch for order '%s': expected %s got %s",
                order_id,
                stored_amount,
                captured_decimal,
            )
            return _json_error(400, "El monto capturado no coincide")
    else:
        logger.info(
            "Capture currency '%s' differs from stored currency '%s' for order '%s'; skipping direct amount validation",
            capture_currency_code or "(desconocida)",
            stored_currency or "(desconocida)",
            order_id,
        )

    payer_email = (capture_data.get("payer") or {}).get("email_address")

    return _finalize_purchase(purchase, db, now, order_id, payer_email)
