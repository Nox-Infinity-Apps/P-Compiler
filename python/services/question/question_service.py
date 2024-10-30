import time
from dataclasses import dataclass
from typing import Union, List

import httpx
from bs4 import BeautifulSoup
from fastapi import UploadFile

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


@dataclass
class Solution:
    id: int
    user: str
    username: str
    problem: str
    problem_name: str
    status: int
    date: str
    time: str
    result: str
    memory: str
    run_time: str
    compiler: str
    color: str


@dataclass
class SolutionResponse:
    code: int
    solutions: List[Solution]  # Chỉnh sửa: đây là danh sách các Solution

    @staticmethod
    def from_json(data: dict) -> 'SolutionResponse':
        # Lấy code từ dữ liệu JSON
        code = data.get("code", 0)

        # Lấy danh sách solutions từ dữ liệu JSON
        solutions_data = data.get("solutions", [])

        # Lặp qua danh sách và tạo các đối tượng Solution
        solutions = [
            Solution(
                id=sol.get("id"),
                user=sol.get("user"),
                username=sol.get("username"),
                problem=sol.get("problem"),
                problem_name=sol.get("problem_name"),
                status=sol.get("status"),
                date=sol.get("date"),
                time=sol.get("time"),
                result=sol.get("result"),
                memory=sol.get("memory"),
                run_time=sol.get("run_time"),
                compiler=sol.get("compiler"),
                color=sol.get("color")
            )
            for sol in solutions_data
        ]
        return SolutionResponse(code, solutions)


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

    async def submit_code(self, code: str, file: UploadFile, lang: int, payload: dict) \
            -> Union[bool, None, str, SolutionResponse]:
        content_file = await file.read()
        _token = self.get_submit_token(code, payload)
        if _token is None:
            return None

        form_data = {
            '_token': _token,
            'question': code,
            'compiler': str(lang),
        }
        files = {
            'code_file': (file.filename, content_file, file.content_type)
        }
        resp = cclient.post("/student/solution",
                            headers={
                                "Cookie": payload.get("cookie"),
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                            },
                            data=form_data,
                            files=files)
        print(payload.get("cookie"))
        print(resp.status_code)
        if resp.status_code != 302:
            return None
        sub_id = self.getStatus(payload)
        if not sub_id:
            return None

        time.sleep(2)
        polling_time = time.time()
        time_out = 60
        quantum = 1
        json = {
            "id": [sub_id]
        }
        print("Tim thay id:", sub_id)
        while time.time() - polling_time <= time_out:
            try:
                response = cclient.post("/api/solution/status",
                                        headers={
                                            "Cookie": payload.get("cookie"),
                                            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                                        },
                                        json=json)
                if response.status_code == 200:
                    try:
                        response_data = response.json()
                        print(response_data)
                        solution_response = SolutionResponse.from_json(response_data)

                        if solution_response.solutions and (solution_response.solutions[0].result == "AC"
                                                            or solution_response.solutions[0].result == "WA"
                                                            or solution_response.solutions[0].result == "TLE"
                                                            or solution_response.solutions[0].result == "OLE"
                                                            or solution_response.solutions[0].result == "IR"
                                                            or solution_response.solutions[0].result == "RTE"
                                                            or solution_response.solutions[0].result == "CE"
                                                            or solution_response.solutions[0].result == "MLE"):
                            return solution_response
                    except ValueError as e:
                        print("Không thể parse JSON:", e)

            except httpx.RequestError as e:
                print(f"Lỗi khi gửi yêu cầu: {e}")
            time.sleep(quantum)
            quantum *= 2
        print("Chưa có kết quả")
        return None

    def getStatus(self, payload: dict):
        history = cclient.get("/student/history",
                              headers={
                                  "Cookie": payload.get("cookie"),
                                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36"
                              })
        if history.status_code != 200:
            return False

        td = BeautifulSoup(history.text, "html.parser").select(
            "div.container-fluid > div.wrapper > div.main--fluid > div.historywork > div.status__table__wrapper > table.status__table > tbody tr")[
            0].find('td')
        sub_id = td.get_text(strip=True)
        return sub_id

    def get_list_by_course(self, course: int, page: int, payload: dict) -> Union[list[Question] | None]:
        _ = cclient.get("/student/question",
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

    def get_detail(self, code: str, payload: dict) -> Union[str | None]:
        response = cclient.get("/student/question/" + code, headers={
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

        # Trả về nội dung của div đã bọc
        return str(wrapper_div)