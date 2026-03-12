from sqlmodel import SQLModel
from uuid import UUID
from pydantic import EmailStr, field_validator


class UserPublic(SQLModel):
    """Public user data for API responses."""
    username: str
    email: EmailStr


class UserCreate(SQLModel):
    """Schema for user registration."""
    username: str
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class UserLogin(SQLModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserJwtInfo(SQLModel):
    """User data to embed in JWT tokens."""
    id: UUID
    username: str
    email: EmailStr
    is_active: bool
