"""Static product catalog and currency conversion helpers."""

from __future__ import annotations

import json
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import Dict, Optional

CATALOG_FILE = Path(__file__).with_name("catalog_data.json")

SUPPORTED_CURRENCIES = {"COP", "USD", "MXN", "ARS", "PEN"}

EXCHANGE_RATES: Dict[str, Decimal] = {
    "COP": Decimal("1"),
    "USD": Decimal("0.00025"),
    "MXN": Decimal("0.0042"),
    "ARS": Decimal("0.23"),
    "PEN": Decimal("0.00094"),
}


@dataclass(frozen=True)
class Product:
    slug: str
    title: str
    price_cop: Optional[int]
    price_cop_year: Optional[int]
    file_key: Optional[str]
    description: str


def _load_products() -> Dict[str, Product]:
    if not CATALOG_FILE.exists():
        raise FileNotFoundError(f"No se encontró el catálogo en {CATALOG_FILE}")

    with CATALOG_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    products: Dict[str, Product] = {}
    for item in data:
        product = Product(
            slug=item["slug"],
            title=item["title"],
            price_cop=item.get("priceCop"),
            price_cop_year=item.get("priceCopYear"),
            file_key=item.get("fileKey"),
            description=item.get("description", ""),
        )
        products[product.slug] = product
    return products


_PRODUCTS = _load_products()


def list_products() -> Dict[str, Product]:
    """Return a copy of the product catalog."""
    return dict(_PRODUCTS)


def get_product(slug: str) -> Optional[Product]:
    """Retrieve a product by slug."""
    return _PRODUCTS.get(slug)


def convert_from_cop(amount_cop: int, currency: str) -> Decimal:
    """Convert a COP amount to the selected currency with rounding."""
    currency_code = currency.upper()
    if currency_code not in SUPPORTED_CURRENCIES:
        raise ValueError(f"Moneda no soportada: {currency}")

    if amount_cop is None:
        raise ValueError("El monto en COP no puede ser nulo.")

    rate = EXCHANGE_RATES[currency_code]
    amount = Decimal(str(amount_cop)) * rate
    quant = Decimal("1") if currency_code == "COP" else Decimal("0.01")
    return amount.quantize(quant, rounding=ROUND_HALF_UP)


def normalize_currency(currency: str) -> str:
    """Normalize and validate the currency code."""
    upper = currency.upper()
    if upper not in SUPPORTED_CURRENCIES:
        raise ValueError(f"Moneda no soportada: {currency}")
    return upper
