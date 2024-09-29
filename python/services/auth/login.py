from python.common.di.manager import Injectable, Inject


@Injectable
class LoginService:

    def login(self, username: str, password: str):
        return {"token": 123}

