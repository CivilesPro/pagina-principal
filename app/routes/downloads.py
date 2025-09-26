"""Endpoints to resolve secure download tokens."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session

from ..database import get_session
from ..models import DownloadToken

router = APIRouter(prefix="/api/download", tags=["downloads"])

S3_BUCKET = os.environ.get("S3_BUCKET")
S3_REGION = os.environ.get("S3_REGION")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
LOCAL_FILES_DIR = Path(os.environ.get("PRIVATE_FILES_DIR", Path.cwd() / "private_files"))


def _generate_presigned_url(file_key: str, expires_in: int) -> Optional[str]:
    if not S3_BUCKET:
        return None

    try:
        import boto3
    except ImportError as exc:  # pragma: no cover - optional dependency
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="El servidor no tiene soporte para S3 (falta boto3).",
        ) from exc

    session = boto3.session.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=S3_REGION,
    )
    client = session.client("s3")

    try:
        return client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": file_key},
            ExpiresIn=expires_in,
        )
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo generar el enlace de descarga.",
        ) from exc


@router.get("/{token_id}")
async def download_file(token_id: str, db: Session = Depends(get_session)):
    token: Optional[DownloadToken] = db.query(DownloadToken).filter(DownloadToken.id == token_id).one_or_none()
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token inválido")

    now = datetime.now(timezone.utc)
    if token.expires_at <= now:
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="El enlace ha expirado")

    if token.used_at is None:
        token.used_at = now
        db.add(token)
        db.commit()

    remaining_seconds = int((token.expires_at - now).total_seconds())
    expires_in = max(60, min(remaining_seconds, 3600))

    if S3_BUCKET:
        presigned = _generate_presigned_url(token.file_key, expires_in=expires_in)
        if presigned:
            return RedirectResponse(presigned)

    safe_path = Path(token.file_key)
    if safe_path.is_absolute() or ".." in safe_path.parts:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ruta de archivo inválida")

    file_path = LOCAL_FILES_DIR / safe_path
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Archivo no encontrado")

    return FileResponse(path=file_path, filename=safe_path.name)
