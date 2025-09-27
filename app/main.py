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
raw_origins = os.environ.get("CORS_ORIGINS")

allowed_origins = {DEFAULT_FRONTEND_ORIGIN}
if raw_origins:
    allowed_origins.update({origin.strip() for origin in raw_origins.split(",") if origin.strip()})

if "*" in allowed_origins:
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = sorted(allowed_origins)
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
