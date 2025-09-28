"""FastAPI application entry point."""

from __future__ import annotations

import os

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import downloads, paypal

init_db()

app = FastAPI(title="Civiles Pro API", version="1.0.0")

DEFAULT_FRONTEND_ORIGIN = "http://localhost:5173"

static_origins = {
    DEFAULT_FRONTEND_ORIGIN,
    "https://civilespro.com",
    "https://www.civilespro.com",
    "https://<tu-dominio-frontend>.vercel.app",
    "https://<tu-dominio-frontend>.netlify.app",
}

raw_origins = os.environ.get("CORS_ORIGINS")
if raw_origins:
    static_origins.update({origin.strip() for origin in raw_origins.split(",") if origin.strip()})

if "*" in static_origins:
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = sorted(static_origins)
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    allow_credentials=allow_credentials,
)


@app.options("/{full_path:path}")
async def preflight_handler(full_path: str) -> Response:
    """Return an empty successful response for CORS preflight requests."""

    return Response(status_code=204)

app.include_router(paypal.router)
app.include_router(downloads.router)


@app.get("/health", tags=["health"])
async def healthcheck():
    return {"status": "ok"}


__all__ = ["app"]
