from pydantic_settings import BaseSettings
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Authentication Service"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/thermos_db"
    SECRET_KEY: str = "supersecretkeychangeinproductionjwt12345!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = "http://localhost:3000,https://thermos-frontend-prod.onrender.com"
    GOOGLE_CLIENT_ID: str = ""

    @property
    def cors_origins(self) -> list[str]:
        value = self.CORS_ORIGINS.strip()
        if value.startswith("["):
            return json.loads(value)
        return [origin.strip() for origin in value.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
