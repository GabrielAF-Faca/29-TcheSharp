from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Minha API"
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = "minhasecretkey"

    class Config:
        env_file = ".env"

settings = Settings()