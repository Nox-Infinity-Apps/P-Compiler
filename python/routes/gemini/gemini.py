from dataclasses import dataclass
from typing import List

from fastapi import APIRouter
from pydantic.v1 import BaseModel

from controllers.gemini.gemini_controller import geminiController
from dtos.gemini.gemini_dto import MessageRequest

router = APIRouter(
    prefix="/gemini"
)


@router.post("")
async def send_message(body: MessageRequest):
    return geminiController.sendMessage(body.code, body.ask_msg, body.chat_history)
