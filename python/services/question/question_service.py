import logging
from dataclasses import dataclass
from typing import Union
from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from utils.env import Environment
from utils.httpx import cptit_client as cclient


@dataclass
class Question:
    status: int
    code: str
    name: str
    group: str
    topic: str
    level: int


@injectable
class QuestionService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def get_submit_token(self, code: str, payload: dict):
        question_html = cclient.get("/student/question/" + code,
                                    headers={
                                        "Cookie": payload.get("cookie"),
                                        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                                    })
        form = BeautifulSoup(question_html.text, "html.parser").select_one(
            "div.container-fluid > div.wrapper > div.main--fluid > div.submit.student__submit > div.submit__pad > form")

        hidden = form.find("input", {"name": "_token"})
        _token = hidden['value'] if hidden else None

        if _token is None:
            return None
        return _token

    def submit_code(self, code: str, file, lang: int, payload: dict) -> Union[bool, None]:
        _token = self.get_submit_token(code, payload)
        if _token is None:
            return False
        print(_token)
        form_data = {
            "_token": _token,
            "question": code,
            "compiler": lang,
        }

        files = {
            "code_file": (file.filename, file.file, file.content_type)
        }
        print("Form data:", form_data)

        resp = cclient.post("/student/solution",
                            headers={
                                "Cookie": payload.get("cookie"),
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
                                "Content-Type": "multipart/form-data"
                            },
                            data=form_data,
                            files=files)

        print(resp.status_code)
        return False

    def get_list_by_course(self, course: int, page: int, payload: dict) -> Union[list[Question] | None]:
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
                               },
                               params={
                                   "page": page
                               })
        soup = BeautifulSoup(response.text, 'html.parser')
        tbody = soup.select_one(
            "div.container-fluid > div.wrapper > div.main--fluid > div.status > div.ques__table__wrapper > table.ques__table > tbody")
        questions = []
        if tbody:
            rows = tbody.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 7:
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
        return questions
