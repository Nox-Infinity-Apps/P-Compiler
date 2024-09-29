from typing import Union


class Settings():
    TEST: str = "This was set in config.py"

    ROUTE_PREFIX: str = "/api/py"
    APP_TITLE: str = "FastAPI - Boilerplate"
    APP_DESCRIPTION: str = "FastAPI, Docker, NGINX, & more"
    APP_VERSION: str = "0.1"
    APP_HOST: str = "localhost"
    APP_PORT: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


class LoggingSettings(Settings):
    LOG_LEVEL: str = "info"
    LOG_FILE: str = ""

    class Config:
        env_file = ".logging.env"
        env_file_encoding = "utf-8"
        case_sensitive = True


class DatabaseSettings(Settings):
    DB_HOST: str = None
    DB_PORT: int = 5432
    DB_USER: str = None
    DB_PASSWORD: str = None


settings = Settings()
logging_settings = LoggingSettings()
database_settings = DatabaseSettings()
