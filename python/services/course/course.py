from dataclasses import dataclass
from typing import Union, List

from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from dtos.course.course import CourseData
from utils.env import Environment
from utils.httpx import cptit_client as cclient


@injectable
class CourseService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def getAllCourse(self,payload) -> Union[List[CourseData], None]:
        response = cclient.get("/student/question", headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        soup = BeautifulSoup(response.text, 'html.parser')
        # Tìm thẻ select có id là 'course'
        select_tag = soup.find('select', {'id': 'course'})
        # Tạo danh sách chứa các option với cặp {value, name}
        course_options : List[CourseData] = [CourseData(value=option['value'], name=option.text)
                          for option in select_tag.find_all('option') if option.has_attr('value')]
        return course_options