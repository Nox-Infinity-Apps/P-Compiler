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

@router.get("/{code}/{course}")
async def questionDetail(code: str,course :str, payload: Dict = Depends(parse_jwt)):
    return questionController.getDetail(code, payload,course)