from fastapi import APIRouter, HTTPException, status
from backend.core.database import SessionDep
from backend.auth.jwt import Token, create_access_token

from .schemas import UserCreate, UserPublic, UserLogin
from .services import (
    register_user,
    authenticate_user,
    EmailAlreadyTaken,
    InvalidCredentials,
    InactiveAccount,
)

router = APIRouter()


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
def auth_login(user: UserLogin, session: SessionDep):
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

    token = create_access_token(user_info.model_dump(mode='json'))
    return Token(access_token=token, token_type="bearer")
