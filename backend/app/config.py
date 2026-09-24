from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "JobHighway API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str = Field(default="postgresql+asyncpg://user:password@localhost:5432/jobhighway", env="DATABASE_URL")
    
    # Redis & Celery Settings
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # Security
    SECRET_KEY: str = Field(default="dev-secret-key-change-in-production", env="SECRET_KEY")
    CORS_ORIGINS: List[str] = Field(default=["*"], env="CORS_ORIGINS")
    
    # AI Settings
    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")
    
    # App Config
    DEFAULT_POLL_INTERVAL_MINUTES: int = Field(default=10, env="DEFAULT_POLL_INTERVAL_MINUTES")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")

settings = Settings()
