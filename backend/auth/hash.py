from pwdlib import PasswordHash
from backend.core.settings import settings
import hmac
import hashlib
import base64

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    """
    Hashes a plain text password using the recommended hashing algorithm in pwdlib.
    Args:
        password (str): The plain text password to be hashed.

    Returns:
        str: The hashed password.
    """
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain text password against a hashed password.
    Args:
        plain_password (str): The plain text password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the password is correct, False otherwise.
    """
    return password_hash.verify(plain_password, hashed_password)


# En producción esto va en variables de entorno

def _fake_salt(email: str) -> str:
    """
    Genera un salt falso determinístico para emails no registrados.
    - Determinístico: el mismo email siempre produce el mismo salt falso,
      así un atacante no puede distinguir entre "no existe" y "existe"
      probando el mismo email dos veces.
    - HMAC: sin el secreto del servidor no se puede predecir ni revertir.
    """
    digest = hmac.new(
        settings._SALT_HMAC_SECRET.encode(),
        email.encode(),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(digest).decode()

