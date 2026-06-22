from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Authentication Service"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/thermos_db"
    SECRET_KEY: str = "supersecretkeychangeinproductionjwt12345!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    GOOGLE_CLIENT_ID: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
