from typing import Dict, Union

from fastapi import APIRouter, Depends, UploadFile, File
from controllers.question.question_controller import questionController
from utils.jwt import parse_jwt

router = APIRouter(
    prefix="/question"
)


@router.get("")
async def question(course: Union[int, None], payload: Dict = Depends(parse_jwt)):
    return await questionController.getList(course, payload)


@router.post("/submit/{code}")
async def submit_question(code: str, lang: int, file: UploadFile, payload: Dict = Depends(parse_jwt)):
    return await questionController.submit(file, code, lang, payload)

@router.get("/{code}/{course}")
async def questionDetail(code: str,course: Union[str, None],  payload: Dict = Depends(parse_jwt)):
    return questionController.getDetail(code, payload,course)