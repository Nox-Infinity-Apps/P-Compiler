from dataclasses import dataclass

from common.di.manager import inject
from dtos.auth.login import LoginDTO
from models.response.template import Unauthorized, Success
from services.auth.login import LoginService
from services.question.question_service import QuestionService
from utils.singleton import singleton


@singleton
class QuestionController:
    @inject(QuestionService)
    def __init__(self, service: QuestionService):
        self.service = service

    def getList(self, course: int, payload: dict):
        data = self.service.get_list_by_course(course, payload)
        return Success("xd", data)


questionController = QuestionController()
