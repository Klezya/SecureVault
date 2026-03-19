from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from backend.shared import get_utc_now
from datetime import timedelta, datetime



class RefreshTokenTable(SQLModel, table=True):
    """Refresh token table model for ORM mapping. Do not use in API schemas."""
    __tablename__ = "refresh_tokens"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID
    token: str = Field(unique=True, index=True)
    expires_at: datetime = Field(default_factory=lambda: get_utc_now() + timedelta(days=7))  # Default to 7 days from now