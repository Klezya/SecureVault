from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ISSUER: str = "Secure Vault - App"
    _SALT_HMAC_SECRET: str = "6660006495acf3b7bd1376f9f7e71ac7c085efa52d0bb93ac52d30d7784f83e9" 

settings = Settings()
