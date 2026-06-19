from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thermos AI - Urban Planning Chatbot Service"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    VECTOR_DB_DIR: str = "./vectordb"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
