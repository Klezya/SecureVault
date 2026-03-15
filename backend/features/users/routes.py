from fastapi import APIRouter, HTTPException, status
from pydantic import EmailStr
from backend.core.database import SessionDep
from backend.auth.jwt import Token, create_access_token

from .schemas import UserCreate, UserPublic, UserLogin, SaltResponse
from .services import (
    register_user,
    authenticate_user,
    get_user_salt,
    EmailAlreadyTaken,
    InvalidCredentials,
    InactiveAccount,

)

router = APIRouter()

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
