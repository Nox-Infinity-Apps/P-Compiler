from fastapi import APIRouter, Depends

from controllers.course.course import courseController
from controllers.history.history import historyController
from utils.jwt import parse_jwt
from models.response.template import Success
from typing import Dict
router = APIRouter(
    prefix="/history"
)


@router.get("/")
async def getHistory(payload: Dict = Depends(parse_jwt)):
    return historyController.getAllHistory(payload)