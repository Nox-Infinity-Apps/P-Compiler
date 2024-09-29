from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class LoginDTO(BaseModel):
    username: str
    password: str
