from dataclasses import dataclass
from typing import List

from common.di.manager import inject
from dtos.gemini.gemini_dto import ChatPart
from models.response.template import Success
from services.gemini.gemini_service import GeminiService
from utils.singleton import singleton


@dataclass
class GeminiResponse:
    response: str


@singleton
class GeminiController:
    @inject(GeminiService)
    def __init__(self, service: GeminiService):
        self.service = service

    def sendMessage(self, code: str, ask_msg: str, history: list[ChatPart]):
        response = self.service.send_message(code, ask_msg, history)
        print(response)
        return Success(message="success", data=GeminiResponse(response=response))


geminiController = GeminiController()