"""FastAPI application entry point."""

from __future__ import annotations

import os

from fastapi import FastAPI
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
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=allow_credentials,
)

app.include_router(paypal.router)
app.include_router(downloads.router)


@app.get("/health", tags=["health"])
async def healthcheck():
    return {"status": "ok"}


__all__ = ["app"]
