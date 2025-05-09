from dataclasses import dataclass
from typing import List, Optional

from pydantic import BaseModel


@dataclass
class History(BaseModel):
    role: str
    part: List[str]


@dataclass
class ChatPart(BaseModel):
    role: str
    parts: List[str]


@dataclass
class MessageRequest(BaseModel):
    ask_msg: str
    chat_history: List[ChatPart]
    code: Optional[str] = None
