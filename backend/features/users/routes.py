from fastapi import APIRouter, HTTPException, status, Cookie, Response
from pydantic import EmailStr
from backend.core.database import SessionDep
from backend.auth.jwt import (Token, 
                              create_access_token, 
                              create_refresh_token, 
                              verify_refresh_token,
                              revoke_refresh_token, 
                              InvalidRefreshToken,
                              )
from .schemas import UserCreate, UserPublic, UserLogin, SaltResponse
from .services import (
    register_user,
    authenticate_user,
    get_user_salt,
    get_user_jwtinfo,
    EmailAlreadyTaken,
    InvalidCredentials,
    InactiveAccount,
    UserNotFound,
)

router = APIRouter()

COOKIE_PARAMS = {
            "key": "refresh_token",
            "httponly": True,
            "secure": True,
            "samesite": "strict",
            "max_age": 7 * 24 * 3600,
        }

@router.get("/auth/salt/", response_model=SaltResponse, status_code=status.HTTP_200_OK)
def auth_get_salt(email: EmailStr, session: SessionDep):
    """Retrieve the salt for a given email."""
    try:
        return get_user_salt(email, session)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the salt, I fucked up",
        )

@router.post("/auth/register/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def auth_register(user: UserCreate, session: SessionDep):
    """Register a new user."""
    try:
        return register_user(user, session)
    except EmailAlreadyTaken:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )


@router.post("/auth/login/", response_model=Token, status_code=status.HTTP_200_OK)
def auth_login(user: UserLogin, session: SessionDep, response: Response):
    """Authenticate a user and return a JWT token."""
    try:
        user_info = authenticate_user(user, session)
    except InvalidCredentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    except InactiveAccount:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive, contact support",
        )

    token = create_access_token(user_info)
    refresh_token = create_refresh_token(user_info.id, prev_token=None, session=session)
    response.set_cookie(value=refresh_token, **COOKIE_PARAMS)
    return Token(access_token=token, token_type="bearer")

@router.post("/auth/refresh/", response_model=Token, status_code=status.HTTP_200_OK)
def auth_refresh_token(session: SessionDep, response: Response, refresh_token: str | None = Cookie(default=None)):
    """Refresh an access token using a valid refresh token."""
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token cookie is missing",
        )
    try:
        user_id = verify_refresh_token(refresh_token, session)
        user_info = get_user_jwtinfo(user_id, session)
        new_access_token = create_access_token(user_info)
        new_refresh_token = create_refresh_token(user_id, refresh_token, session)
        response.set_cookie(value=new_refresh_token, **COOKIE_PARAMS)
        return Token(access_token=new_access_token, token_type="bearer")

    except InvalidRefreshToken:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    except UserNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

@router.post("/auth/logout/", status_code=status.HTTP_204_NO_CONTENT)
def auth_logout(session: SessionDep, response: Response, refresh_token: str | None = Cookie(default=None)):
    """Logout a user by revoking their refresh token."""
    if refresh_token:
        revoke_refresh_token(refresh_token, session)
    response.delete_cookie("refresh_token")