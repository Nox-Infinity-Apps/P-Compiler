from dataclasses import dataclass

from common.di.manager import inject
from dtos.auth.login import LoginDTO
from models.response.template import Unauthorized, Success
from services.auth.login import LoginService
from utils.singleton import singleton


@dataclass
class LoginData:
    access_token: str


@singleton
class LoginController:
    @inject(LoginService)
    def __init__(self, service: LoginService):
        self.service = service

    def loginWithCredentials(self, body: LoginDTO):
        data = self.service.login(body.username, body.password)
        if data is None:
            return Unauthorized(message="Username or password was wrong!")
        return Success(message="Login successfully", data=LoginData(access_token=data))


loginController = LoginController()
