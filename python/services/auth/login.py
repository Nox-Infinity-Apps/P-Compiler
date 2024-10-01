from datetime import timezone, datetime, timedelta
from typing import Union

import jwt
from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from utils.env import Environment
from utils.httpx import cptit_client as cclient


@injectable
class LoginService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def login(self, username: str, password: str) -> Union[str, None]:
        response = cclient.get("/login", headers={
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
        })

        soup = BeautifulSoup(response.text, 'html.parser')
        csrf_token = soup.select("form.login__main__form input[name=_token]")[0].get("value")
        login = cclient.post("/login", data={
            "_token": csrf_token,
            "username": username,
            "password": password
        })
        cookie2 = login.headers.get("Set-Cookie")
        cookie_parts = [part.strip() for part in cookie2.replace(",", ";").split(";")]

        xsrf_token = next((part for part in cookie_parts if part.startswith("XSRF-TOKEN")), None)
        ptit_code_session = next((part for part in cookie_parts if part.startswith("ptit_code_session")), None)

        if 'location' in login.headers and 'login' not in login.headers.get("location"):
            return jwt.encode({
                'username': username,
                'cookie': xsrf_token + "; " + ptit_code_session,
                'exp': datetime.now(timezone.utc) + timedelta(days=self.env.jwt_expire_time)
            }, self.env.jwt_secret, algorithm="HS256")
        return None
