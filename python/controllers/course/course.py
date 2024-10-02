from dataclasses import dataclass

from common.di.manager import inject
from models.response.template import Success, Failed
from services.course.course import CourseService
from utils.singleton import singleton

@singleton
class CourseController:
    @inject(CourseService)
    def __init__(self, service: CourseService):
        self.service = service

    def getAllCourse(self, payload):
        data = self.service.getAllCourse(payload)
        if data is None:
            return Failed(message="Failed to get course data")
        return Success(message="Success", data=data)


courseController = CourseController()