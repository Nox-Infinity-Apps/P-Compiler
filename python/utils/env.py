from pydantic_settings import BaseSettings, SettingsConfigDict

from common.di.manager import injectable
from utils.singleton import singleton


@injectable
@singleton
class Environment(BaseSettings):
    port: int = 1234
    jwt_secret: str
    jwt_expire_time: int = 7
    db_postgres_host: str
    db_postgres_user: str
    db_postgres_password: str
    db_postgres_name: str
    db_postgres_port: int = 5432
    model_config = SettingsConfigDict(env_file=".env")


environment = Environment()
