"""Utility helpers to communicate with the PayPal REST API."""

from __future__ import annotations

import logging
import os
from typing import Any, Dict

import httpx

logger = logging.getLogger(__name__)

PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.environ.get("PAYPAL_CLIENT_SECRET")
PAYPAL_ENV = os.environ.get("PAYPAL_ENV", "sandbox").lower()

PAYPAL_BASE_URL = "https://api-m.paypal.com" if PAYPAL_ENV == "live" else "https://api-m.sandbox.paypal.com"

logger.info(
    "PayPal client configured for '%s' environment. Client ID set: %s, client secret set: %s",
    PAYPAL_ENV,
    "yes" if PAYPAL_CLIENT_ID else "no",
    "yes" if PAYPAL_CLIENT_SECRET else "no",
)


class PayPalError(RuntimeError):
    """Raised when the PayPal API returns an error."""


async def _get_access_token() -> str:
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise PayPalError("Las credenciales de PayPal no están configuradas.")

    try:
        async with httpx.AsyncClient(base_url=PAYPAL_BASE_URL, timeout=20.0) as client:
            response = await client.post(
                "/v1/oauth2/token",
                data={"grant_type": "client_credentials"},
                auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
                headers={"Accept": "application/json", "Accept-Language": "es-ES"},
            )
    except httpx.RequestError as exc:  # pragma: no cover - network failure safeguard
        logger.error("PayPal token request failed: %s", exc)
        raise PayPalError("No se pudo conectar con PayPal para obtener el token de acceso.") from exc

    if response.status_code >= 400:
        detail = response.text
        logger.error(
            "PayPal token request returned %s: %s",
            response.status_code,
            detail,
        )
        raise PayPalError(f"No se pudo obtener el token de acceso de PayPal: {detail}")

    data = response.json()
    token = data.get("access_token")
    if not token:
        logger.error("PayPal token response without access_token field: %s", data)
        raise PayPalError("Respuesta inválida de PayPal al solicitar el token de acceso.")

    return token


async def create_order(amount_value: str, currency_code: str, description: str, reference_id: str) -> Dict[str, Any]:
    """Create a PayPal order and return the API response."""

    access_token = await _get_access_token()

    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": reference_id,
                "description": description[:127],
                "amount": {
                    "currency_code": currency_code,
                    "value": amount_value,
                },
            }
        ],
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(base_url=PAYPAL_BASE_URL, timeout=20.0) as client:
            response = await client.post("/v2/checkout/orders", json=payload, headers=headers)
    except httpx.RequestError as exc:  # pragma: no cover - network failure safeguard
        logger.error("PayPal create order request failed: %s", exc)
        raise PayPalError("No se pudo conectar con PayPal para crear la orden.") from exc

    if response.status_code >= 400:
        logger.error(
            "PayPal create order request returned %s: %s",
            response.status_code,
            response.text,
        )
        raise PayPalError(f"Error al crear la orden en PayPal: {response.text}")

    return response.json()


async def capture_order(order_id: str) -> Dict[str, Any]:
    """Capture a previously approved PayPal order."""

    access_token = await _get_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(base_url=PAYPAL_BASE_URL, timeout=20.0) as client:
            response = await client.post(f"/v2/checkout/orders/{order_id}/capture", headers=headers)
    except httpx.RequestError as exc:  # pragma: no cover - network failure safeguard
        logger.error("PayPal capture order request failed for %s: %s", order_id, exc)
        raise PayPalError("No se pudo conectar con PayPal para capturar la orden.") from exc

    if response.status_code >= 400:
        logger.error(
            "PayPal capture order request returned %s for %s: %s",
            response.status_code,
            order_id,
            response.text,
        )
        raise PayPalError(f"Error al capturar la orden {order_id}: {response.text}")

    return response.json()
