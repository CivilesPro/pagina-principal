"""FastAPI routes to manage the PayPal checkout flow."""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .. import catalog
from ..database import get_session
from ..models import DownloadToken, Purchase
from ..paypal_client import PayPalError, capture_order as paypal_capture_order, create_order as paypal_create_order

router = APIRouter(prefix="/api/paypal", tags=["paypal"])

DOWNLOAD_TOKEN_TTL_HOURS = int(os.environ.get("DOWNLOAD_TOKEN_TTL_HOURS", "24"))
BACKEND_BASE_URL = os.environ.get("BACKEND_BASE_URL")


class CreateOrderRequest(BaseModel):
    slug: str = Field(..., description="Identificador del producto")
    currency: str = Field(..., min_length=3, max_length=3)


class CreateOrderResponse(BaseModel):
    orderID: str


class CaptureOrderRequest(BaseModel):
    orderID: str = Field(..., min_length=3)


class CaptureOrderResponse(BaseModel):
    downloadUrl: str


def _amount_to_string(value: Decimal) -> str:
    return f"{value:.2f}"


def _build_download_url(token_id: str) -> str:
    if BACKEND_BASE_URL:
        return f"{BACKEND_BASE_URL.rstrip('/')}/api/download/{token_id}"
    return f"/api/download/{token_id}"


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order_endpoint(payload: CreateOrderRequest, db: Session = Depends(get_session)) -> CreateOrderResponse:
    currency = payload.currency.upper()
    try:
        currency = catalog.normalize_currency(currency)
    except ValueError as exc:  # pragma: no cover - validation
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    product = catalog.get_product(payload.slug)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    if product.price_cop is None or not product.file_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este producto no está disponible para compra en línea.",
        )

    amount_decimal = catalog.convert_from_cop(product.price_cop, currency)
    try:
        paypal_response = await paypal_create_order(
            amount_value=_amount_to_string(amount_decimal),
            currency_code=currency,
            description=f"CivilesPro - {product.title}",
            reference_id=product.slug,
        )
    except PayPalError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    order_id = paypal_response.get("id")
    if not order_id:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Respuesta inválida de PayPal")

    purchase = Purchase(
        slug=product.slug,
        title=product.title,
        order_id=order_id,
        amount=amount_decimal,
        currency=currency,
        status="CREATED",
    )

    db.add(purchase)
    db.commit()

    return CreateOrderResponse(orderID=order_id)


@router.post("/capture-order", response_model=CaptureOrderResponse)
async def capture_order_endpoint(payload: CaptureOrderRequest, db: Session = Depends(get_session)) -> CaptureOrderResponse:
    order_id = payload.orderID
    purchase: Optional[Purchase] = db.query(Purchase).filter(Purchase.order_id == order_id).one_or_none()

    if not purchase:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orden no registrada")

    now = datetime.now(timezone.utc)

    if purchase.status == "COMPLETED":
        existing_token = (
            db.query(DownloadToken)
            .filter(DownloadToken.order_id == order_id)
            .order_by(DownloadToken.created_at.desc())
            .first()
        )
        if existing_token and existing_token.expires_at > now:
            return CaptureOrderResponse(downloadUrl=_build_download_url(existing_token.id))

    try:
        capture_data = await paypal_capture_order(order_id)
    except PayPalError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    if capture_data.get("status") != "COMPLETED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La orden no fue completada.")

    purchase_units = capture_data.get("purchase_units") or []
    if not purchase_units:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Orden de PayPal inválida")

    first_unit = purchase_units[0]
    payments = first_unit.get("payments", {})
    captures = payments.get("captures") or []
    if not captures:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La orden no tiene capturas registradas")

    capture_entry = captures[0]
    if capture_entry.get("status") != "COMPLETED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La captura no fue completada")

    capture_amount = capture_entry.get("amount", {})
    captured_value = capture_amount.get("value")
    captured_currency = capture_amount.get("currency_code")

    if not captured_value or not captured_currency:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Monto de captura inválido")

    try:
        captured_decimal = Decimal(captured_value)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Monto de captura inválido") from exc

    if captured_currency.upper() != purchase.currency.upper():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Moneda de captura inválida")

    stored_amount = Decimal(purchase.amount)
    if captured_decimal != stored_amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El monto capturado no coincide")

    payer_email = (capture_data.get("payer") or {}).get("email_address")

    purchase.status = "COMPLETED"
    purchase.payer_email = payer_email
    db.add(purchase)

    product = catalog.get_product(purchase.slug)
    if not product or not product.file_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Producto sin archivo configurado")

    expires_at = now + timedelta(hours=DOWNLOAD_TOKEN_TTL_HOURS)
    token = DownloadToken(
        id=str(uuid4()),
        slug=purchase.slug,
        file_key=product.file_key,
        order_id=order_id,
        payer_email=payer_email,
        expires_at=expires_at,
    )
    db.add(token)
    db.commit()

    return CaptureOrderResponse(downloadUrl=_build_download_url(token.id))
