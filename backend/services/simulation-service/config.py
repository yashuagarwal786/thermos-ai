from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Climate Simulation Engine"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
