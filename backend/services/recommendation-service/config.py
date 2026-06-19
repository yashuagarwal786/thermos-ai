from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Urban Mitigation Recommendation Service"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
