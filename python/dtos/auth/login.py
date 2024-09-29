from dataclasses import dataclass

@dataclass
class LoginDTO:
    username: str
    password: str

d =  LoginDTO(username="assa",)