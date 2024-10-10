from dataclasses import dataclass
from typing import Union, List
from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from dtos.course.course import CourseData
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

@dataclass
class QuestionDetail :
    hmtl : str
    languages : List[CourseData]


@injectable
class QuestionService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def get_list_by_course(self, course: int, payload: dict) -> Union[list[Question] | None]:
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

    def get_detail(self, code: str, payload: dict,course : str) -> Union[QuestionDetail | None]:
        _ = cclient.get("student/question?course=" + course, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        response = cclient.get(f"/student/question/{code}", headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        soup = BeautifulSoup(response.text, 'html.parser')
        # Tìm tất cả các thẻ HTML có class 'submit__nav', 'submit__des', 'submit__req'
        elements = soup.find_all(class_=["submit__nav", "submit__des", "submit__req"])

        # Tạo một div mới để bọc tất cả các thẻ đã tìm thấy
        wrapper_div = soup.new_tag('div')

        for element in elements:
            wrapper_div.append(element)

        # Lấy thẻ select
        select_tag = soup.find('select', id='compiler')

        # Tạo danh sách {value, name}
        options : List[CourseData] = [{'value': option['value'], 'name': option.text} for option in select_tag.find_all('option')]

        # Trả về nội dung của div đã bọc

        return QuestionDetail(str(wrapper_div), options)