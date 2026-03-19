import jwt
import secrets
from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import timedelta
from fastapi import HTTPException, status
from sqlmodel import SQLModel, Session, select, delete

from backend.core.settings import settings
from backend.auth.models import RefreshTokenTable
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

class InvalidRefreshToken(Exception):
    """Custom exception for invalid refresh tokens."""

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

def revoke_all_user_refresh_tokens(user_id: UUID, session: Session):
    statement = delete(RefreshTokenTable).where(RefreshTokenTable.user_id == user_id)
    session.exec(statement)
    session.commit()

def revoke_refresh_token(token: str, session: Session):
    statement = delete(RefreshTokenTable).where(RefreshTokenTable.token == token)
    session.exec(statement)
    session.commit()

def create_refresh_token(user_id: UUID, prev_token: str | None, session: Session) -> str:
    # Invalida tokens anteriores del usuario (opcional pero recomendado)
    if prev_token:
        revoke_refresh_token(prev_token, session)

    token = secrets.token_hex(64)
    db_token = RefreshTokenTable(user_id=user_id, token=token)
    session.add(db_token)
    session.commit()
    return token

def verify_refresh_token(token: str, session: Session) -> UUID:
    statement = select(RefreshTokenTable).where(
        RefreshTokenTable.token == token,
        RefreshTokenTable.expires_at > get_utc_now()
    )
    db_token = session.exec(statement).first()
    if db_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return db_token.user_id