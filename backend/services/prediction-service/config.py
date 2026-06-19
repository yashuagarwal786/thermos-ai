from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Temperature Forecasting Service"
    MODEL_REGISTRY_DIR: str = "./models"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/thermos_db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
