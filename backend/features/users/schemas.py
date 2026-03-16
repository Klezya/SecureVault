from sqlmodel import SQLModel
from pydantic import EmailStr, field_validator


class UserPublic(SQLModel):
    """Public user data for API responses."""
    username: str
    email: EmailStr


class UserCreate(SQLModel):
    """Schema for user registration."""
    username: str
    email: EmailStr
    auth_hash: str
    salt_base64: str


class UserLogin(SQLModel):
    """Schema for user login."""
    email: EmailStr
    auth_hash: str

class SaltResponse(SQLModel):
    """Response schema for salt retrieval."""
    salt_base64: str


