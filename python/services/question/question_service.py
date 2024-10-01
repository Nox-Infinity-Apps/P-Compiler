from typing import Union

import httpx
import jwt
from bs4 import BeautifulSoup
from fastapi import Cookie

from common.di.manager import injectable, inject
from utils.env import Environment
from utils.httpx import cptit_client as cclient


class Question:
    status: int
    code: str
    name: str
    group: str
    topic: str


@injectable
class QuestionService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def get_list_by_course(self, course: int, payload: dict) -> Union[str, None]:
        call = httpx.Client(base_url="https://code.ptit.edu.vn").get("/student/question",
                               headers={
                                   "Cookie": payload.get("cookie"),
                                   "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                               },
                               params={
                                   "course": course
                               })
        response = httpx.Client(base_url="https://code.ptit.edu.vn").get("/student/question",
                               headers={
                                   "Cookie": payload.get("cookie"),
                                   "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                               })
        soup = BeautifulSoup(response.text, 'html.parser')
        print(soup)
        return "xd"
