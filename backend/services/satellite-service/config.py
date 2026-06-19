from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Satellite Image Processing Service"
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    ALLOWED_EXTENSIONS: set = {".tif", ".tiff", ".png", ".jpg", ".jpeg"}
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/thermos_db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
