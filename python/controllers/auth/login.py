from common.di.manager import inject
from dtos.auth.login import LoginDTO
from services.auth.login import LoginService
from utils.singleton import singleton


@singleton
class LoginController:
    @inject(LoginService)
    def __init__(self, service: LoginService):
        self.service = service

    def loginWithCredentials(self, body: LoginDTO):
        data = self.service.login(body.username, body.password)
        return {"token": data.get("token")}


loginController = LoginController()
