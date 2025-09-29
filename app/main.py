"""FastAPI application entry point."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import downloads, paypal

init_db()

app = FastAPI(title="Civiles Pro API", version="1.0.0")

ALLOWED_ORIGINS = [
    "https://civilespro.com",
    "https://www.civilespro.com",
    "https://min.civilespro.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,        # pon True solo si usas cookies/sesión
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


app.include_router(paypal.router)
app.include_router(downloads.router)


@app.get("/health", tags=["health"])
async def healthcheck():
    return {"status": "ok"}


__all__ = ["app"]
