from fastapi import APIRouter, Depends

from controllers.compile.compile import compileController
from dtos.compile.compile import CompileBody
from utils.jwt import parse_jwt
from models.response.template import Success
from typing import Dict
router = APIRouter(
    prefix="/compile"
)


@router.post("/{id}")
async def compile(payload: Dict = Depends(parse_jwt), body :CompileBody = None, id:str = None):
    return compileController.compileCode(payload , body,id)


