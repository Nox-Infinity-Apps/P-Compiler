import os
from typing import List

import google.generativeai as genai

from common.di.manager import injectable
from dtos.gemini.gemini_dto import ChatPart

API_KEY = "AIzaSyAJ9NyYmFG3AA5TbgnsQImZF5wujqd_Mew"

@injectable
class GeminiService:
    def send_message(self, code: str, ask_msg: str, chat_history: List[ChatPart]) -> str:
        genai.configure(api_key=API_KEY)

        print(code)
        # Create the model
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )
        chat_session = model.start_chat(
            history=self.create_history(chat_history)
        )
        response = chat_session.send_message("Tôi có đoạn code sau:\n"
                                             "```\n"+code+"\n```\n"
                                             +ask_msg)

        return response.text

    def create_history(self,list_chat: List[ChatPart]) -> []:
        history = []
        for i in list_chat:
            history.append(self.create_chat(i.role, i.parts[0]))
        return history

    def create_chat(self, role: str, msg: str) -> {}:
        return {
            "role": role,
            "parts": [
                msg
            ],
        }

