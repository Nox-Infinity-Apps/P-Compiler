from typing import Dict

from fastapi import APIRouter, Depends
from controllers.question.question_controller import questionController
from utils.jwt import parse_jwt

router = APIRouter(
    prefix="/question"
)


@router.get("")
async def question(course: int, payload: Dict = Depends(parse_jwt)):
    return questionController.getList(course, payload)

@router.get("/{code}")
async def questionDetail(code: str, payload: Dict = Depends(parse_jwt)):
    return questionController.getDetail(code, payload)