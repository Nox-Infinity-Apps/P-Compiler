from fastapi import APIRouter, Depends
from controllers.user.user import userController
from utils.jwt import parse_jwt
from typing import Dict
router = APIRouter(
    prefix="/user"
)


@router.get("/")
async def getDetail(payload: Dict = Depends(parse_jwt)):
    return userController.getUserDetail(payload)