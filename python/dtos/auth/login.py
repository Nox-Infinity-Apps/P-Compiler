from dataclasses import dataclass

from python.models.base.reponse import BaseResponse


@dataclass
class LoginRequest:
    username: str
    password: str


class LoginResponse(BaseResponse):
    x: str
