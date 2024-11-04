from dataclasses import dataclass

from common.di.manager import inject
from models.response.template import Success, Failed
from services.compile.compile import CompileService
from services.course.course import CourseService
from utils.singleton import singleton

@singleton
class CompileController:
    @inject(CompileService)
    def __init__(self, service: CompileService):
        self.service = service

    def compileCode(self, payload, body,id):
        data = self.service.compile(payload,body,id)
        if type(data) == str:
            return Failed(message=data)
        return Success(message="Success", data=data)


compileController = CompileController()