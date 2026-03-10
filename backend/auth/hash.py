from pwdlib import PasswordHash

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

