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

@router.get("/rank/{course}")
async def getRank(course: str, payload: Dict = Depends(parse_jwt)):
    return userController.getRank(course, payload)

@router.get("/statistics/{account}")
async def getStatistics(account: str,from_date:str, to_date:str, payload: Dict = Depends(parse_jwt)):
    return userController.getStatistics(account, payload, from_date, to_date)
