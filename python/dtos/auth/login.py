from dataclasses import dataclass

@dataclass
class LoginDTO:
    username: str
    password: str

d = new LoginDTO(username="assa",)