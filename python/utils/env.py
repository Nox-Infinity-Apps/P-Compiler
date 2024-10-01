from pydantic_settings import BaseSettings, SettingsConfigDict

from common.di.manager import injectable
from utils.singleton import singleton


@injectable
@singleton
class Environment(BaseSettings):
    port: int = 1234
    jwt_secret: str
    jwt_expire_time: int = 7
    model_config = SettingsConfigDict(env_file=".env")


environment = Environment()
