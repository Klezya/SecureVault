import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import timedelta

from backend.core.settings import settings
from backend.shared import get_utc_now



class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    data_to_encode = data.copy()

    time_to_expire = get_utc_now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    data_to_encode.update({"exp": time_to_expire})

    data_to_encode.update({"iss": settings.ISSUER})

    encoded_jwt = jwt.encode(
        data_to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
        )
    
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM],
            issuer=settings.ISSUER
            )
        return payload
    except jwt.PyJWTError:
        return None