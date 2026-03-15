from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from pydantic import EmailStr


class UserTable(SQLModel, table=True):
    """User table model for ORM mapping. Do not use in API schemas."""
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str
    email: EmailStr = Field(index=True, unique=True)
    auth_hash: str
    salt_base64: str
    is_active: bool = Field(default=True)