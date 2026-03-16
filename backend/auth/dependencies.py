from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from backend.auth.jwt import verify_access_token, UserJwtInfo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/")

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserJwtInfo:
    """
    Extrae y valida el JWT del header Authorization: Bearer <token>.
    verify_access_token ya lanza HTTPException si el token es inválido.
    """
    payload = verify_access_token(token)
    return UserJwtInfo.model_validate(payload)