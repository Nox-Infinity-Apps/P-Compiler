import time
from datetime import timezone, datetime, timedelta
from typing import Union

import httpx
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

    def get_csrf(self):
        cclient.follow_redirects = True
        response = cclient.get("/login", headers={
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
        })
        soup = BeautifulSoup(response.text, 'html.parser')
        csrf = soup.select_one('form.login__main__form input[name="_token"]')
        return csrf, response

    def check_logged(self, soup):
        tbody = soup.select_one(
            "div.container-fluid > div.wrapper > div.main--fluid > div.status > div.ques__table__wrapper > table.ques__table > tbody")
        if tbody is None:
            return None
        return True

    def login(self, username: str, password: str) -> Union[str, None]:
        csrf, response = self.get_csrf()
        if csrf is None:
            if self.check_logged(BeautifulSoup(response.text, 'html.parser')):
                # print("vai lon luon")
                return self.build_jwt(username, response, True)
            return None
        csrf_token = csrf.get('value')
        # print("CSRF Token: " + csrf_token)
        cclient.follow_redirects = False
        login = cclient.post("/login", data={
            "_token": csrf_token,
            "username": username,
            "password": password
        })
        return self.build_jwt(username, login, False)

    def build_jwt(self, username, response: httpx.Response, is_logged: bool):
        cookie2 = response.headers.get("Set-Cookie")
        cookie_parts = [part.strip() for part in cookie2.replace(",", ";").split(";")]

        xsrf_token = next((part for part in cookie_parts if part.startswith("XSRF-TOKEN")), None)
        ptit_code_session = next((part for part in cookie_parts if part.startswith("ptit_code_session")), None)
        if ('location' in response.headers and 'login' not in response.headers.get("location")) or is_logged:
            return jwt.encode({
                'username': username,
                'cookie': xsrf_token + "; " + ptit_code_session,
                'exp': datetime.now(timezone.utc) + timedelta(days=self.env.jwt_expire_time)
            }, self.env.jwt_secret, algorithm="HS256")
        return None
