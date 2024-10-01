from typing import Dict

from fastapi import APIRouter, Depends

from controllers.auth.login import loginController
from controllers.question.question_controller import questionController
from dtos.auth.login import LoginDTO
from models.response.template import Success
from utils.jwt import parse_jwt

router = APIRouter(
    prefix="/auth"
)


@router.post("/login")
async def login(body: LoginDTO):
    return loginController.loginWithCredentials(body)


@router.get("/test")
async def protected(payload: Dict = Depends(parse_jwt)):
    return Success(message="HI", data=payload)
