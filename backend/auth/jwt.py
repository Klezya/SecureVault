import jwt
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import timedelta
from fastapi import HTTPException, status
from sqlmodel import SQLModel

from backend.core.settings import settings
from backend.shared import get_utc_now

class UserJwtInfo(SQLModel):
    """User data to embed in JWT tokens."""
    id: UUID
    username: str
    email: EmailStr
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(user: UserJwtInfo) -> str:
    data_to_encode = user.model_dump(mode='json')

    now = get_utc_now()
    time_to_expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    data_to_encode.update({"exp": time_to_expire,
                           "iat": now,
                           "iss": settings.ISSUER})

    encoded_jwt = jwt.encode(
        data_to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
        )
    
    return encoded_jwt

def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM],
            issuer=settings.ISSUER
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )