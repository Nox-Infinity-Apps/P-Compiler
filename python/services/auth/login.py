from python.common.di.manager import injectable, inject


@injectable
class LoginService:
    def login(self, username: str, password: str):
        return {"token": 123}

