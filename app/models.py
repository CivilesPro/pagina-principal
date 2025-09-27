"""SQLAlchemy models for purchases and secure downloads."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, Integer, Numeric, String, func, Index

from .database import Base


class Purchase(Base):
    """Represents a PayPal purchase initiated from the storefront."""

    __tablename__ = "purchases"
    __table_args__ = (
        Index("ix_purchases_order_id", "order_id", unique=True),
        Index("ix_purchases_slug", "slug"),
    )

    id: int = Column(Integer, primary_key=True, index=True)
    slug: str = Column(String(100), nullable=False)
    title: str = Column(String(255), nullable=False)
    order_id: str = Column(String(64), nullable=False, unique=True)
    amount: Numeric = Column(Numeric(12, 2), nullable=False)
    currency: str = Column(String(3), nullable=False)
    status: str = Column(String(32), nullable=False)
    payer_email: Optional[str] = Column(String(255), nullable=True)
    created_at: datetime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: datetime = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class DownloadToken(Base):
    """Secure download tokens tied to captured PayPal orders."""

    __tablename__ = "download_tokens"
    __table_args__ = (
        Index("ix_download_tokens_order_id", "order_id"),
        Index("ix_download_tokens_expires_at", "expires_at"),
    )

    id: str = Column(String(36), primary_key=True, index=True)
    slug: str = Column(String(100), nullable=False)
    file_key: str = Column(String(255), nullable=False)
    order_id: str = Column(String(64), nullable=False)
    payer_email: Optional[str] = Column(String(255), nullable=True)
    expires_at: datetime = Column(DateTime(timezone=True), nullable=False)
    used_at: Optional[datetime] = Column(DateTime(timezone=True), nullable=True)
    created_at: datetime = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
