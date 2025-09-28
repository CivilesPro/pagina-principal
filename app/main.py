"""FastAPI application entry point."""

from __future__ import annotations

import os

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import downloads, paypal

init_db()

app = FastAPI(title="Civiles Pro API", version="1.0.0")


DEFAULT_ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "https://civilespro.com",
    "https://www.civilespro.com",
    "https://app.civilespro.com",
    "https://<tu-dominio-frontend>.vercel.app",
    "https://<tu-dominio-frontend>.netlify.app",
}


def _get_allowed_origins() -> list[str]:
    """Return allowed origins from defaults and the ALLOWED_ORIGINS env var."""

    env_origins = {
        origin.strip()
        for origin in os.environ.get("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    }
    origins = DEFAULT_ALLOWED_ORIGINS | env_origins
    if "*" in origins:
        return ["*"]
    return sorted(origins)


allowed_origins = _get_allowed_origins()
allow_credentials = "*" not in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
