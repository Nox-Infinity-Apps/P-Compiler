from pydantic_settings import BaseSettings, SettingsConfigDict

from common.di.manager import injectable
from utils.singleton import singleton


@singleton
@injectable
class Environment(BaseSettings):
    port: int = 1234
    jwt_secret: str
    model_config = SettingsConfigDict(env_file=".env")


environment = Environment()
