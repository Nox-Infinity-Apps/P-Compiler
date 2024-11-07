from dataclasses import dataclass
from typing import List

from fastapi import UploadFile

from common.di.manager import inject
from dtos.auth.login import LoginDTO
from models.response.template import Unauthorized, Success, BadRequest
from services.auth.login import LoginService
from services.question.question_service import QuestionService, Question
from utils.singleton import singleton


@singleton
class QuestionController:
    @inject(QuestionService)
    def __init__(self, service: QuestionService):
        self.service = service

    async def getList(self, course: int, page: int, payload: dict):
        data = await self.service.get_list_by_course(course, page, payload)
        return Success("success", data=data)

    async def submit(self, file: UploadFile, code: str, lang: int, payload: dict):
        sub = await self.service.submit_code(code, file, lang, payload)
        if sub is None:
            return BadRequest("fail", "400")

        return Success("success", data=sub)


questionController = QuestionController()
