from fastapi import APIRouter, HTTPException, status
from backend.core.database import SessionDep
from backend.auth.jwt import Token, create_access_token

from .repository import insert_user
from .models import UserCreate, UserPublic, UserLogin
from .services import is_email_taken, authenticate_user

router = APIRouter()

@router.post("/auth/register/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def auth_register(user: UserCreate, session: SessionDep):
    """
    Endpoint to register a new user.
    Args:
        user (UserCreate): The user data to create.
    Returns:
        UserPublic: The created user data.
    """
    # Verificar si el email ya está registrado
    if is_email_taken(email=user.email, session=session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Email is already registered"
        )

    # Retornar informacion del usuario creado
    user_created = insert_user(user, session)

    # Formatear Salida
    user_out = UserPublic(
        username=user_created.username,
        email=user_created.email
    )

    return user_out

@router.post("/auth/login/", response_model=Token, status_code=status.HTTP_200_OK)
def auth_login(user: UserLogin, session: SessionDep):
    """
    Endpoint to authenticate a user and return a JWT token.
    Args:
        user (UserLogin): The user login data.
    Returns:
        Token: The JWT token for the authenticated user.
    """

    # Verificar si el usuario existe en la base de datos
    # Verificar si la contraseña es correcta
    user_database_data = authenticate_user(user, session)
    if not user_database_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    # Verificar si el usuario esta activo
    if not user_database_data.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="User account is inactive, contact support"
        )

    # Armar el JWT y Returnar el JWT
    jwt = create_access_token(user_database_data.model_dump())
    token_model = Token(
        access_token=jwt, 
        token_type="bearer"
    )

    return token_model

