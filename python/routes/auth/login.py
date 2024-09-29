from fastapi import APIRouter

from python.controllers.auth.login import loginController
from python.dtos.auth.login import LoginDTO

router = APIRouter(
    prefix="/auth"
)

@router.post("/login")
async def login(body: LoginDTO):
    return loginController.loginWithCredentials(body)
