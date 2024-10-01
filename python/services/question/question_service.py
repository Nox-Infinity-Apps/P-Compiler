from typing import Union

import httpx
import jwt
from bs4 import BeautifulSoup
from fastapi import Cookie

from common.di.manager import injectable, inject
from utils.env import Environment
from utils.httpx import cptit_client as cclient


class Question:
    def __init__(self, status, code, name, group, topic, level):
        self.status = status
        self.code = code
        self.name = name
        self.group = group
        self.topic = topic
        self.level = level


@injectable
class QuestionService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def get_list_by_course(self, course: int, payload: dict) -> Union[str, None]:
        call = cclient.get("/student/question",
                               headers={
                                   "Cookie": payload.get("cookie"),
                                   "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                               },
                               params={
                                   "course": course
                               })
        response = cclient.get("/student/question",
                               headers={
                                   "Cookie": payload.get("cookie"),
                                   "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                               })
        soup = BeautifulSoup(response.text, 'html.parser')
        tbody = soup.select_one("div.container-fluid > div.wrapper > div.main--fluid > div.status > div.ques__table__wrapper > table.ques__table > tbody")
        questions = []
        if tbody:
            rows = tbody.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 7:
                    # Lấy các thẻ <td> thứ 3 đến 7 (theo yêu cầu của bạn)
                    code = cols[2].text.strip()  # Mã
                    name = cols[3].text.strip()  # Tên
                    group = cols[4].text.strip()  # Nhóm
                    topic = cols[5].text.strip()  # Chủ đề
                    level = int(cols[6].text.strip())  # Độ khó

                    if 'bg--10th' in row.get('class', []):
                        status = 1
                    elif 'bg--50th' in row.get('class', []):
                        status = 0
                    else:
                        status = -1

                    question = Question(status, code, name, group, topic, level)
                    questions.append(question)
        for question in questions:
            print(
                f"Status: {question.status}, Code: {question.code}, Name: {question.name}, Group: {question.group}, Topic: {question.topic}, Level: {question.level}")
        print(len(questions))
        return "xd"
