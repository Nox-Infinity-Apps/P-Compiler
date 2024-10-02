from fastapi import APIRouter, Depends

from controllers.course.course import courseController
from utils.jwt import parse_jwt
from models.response.template import Success
from typing import Dict
router = APIRouter(
    prefix="/course"
)


@router.get("/")
async def getCourse(payload: Dict = Depends(parse_jwt)):
    return courseController.getAllCourse(payload)


