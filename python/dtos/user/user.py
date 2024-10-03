from dataclasses import dataclass


@dataclass
class UserData:
    username: str
    image: str
    account: str
    class_ : str
    email: str
    date: str
    gender: str
    location: str
    phone: str
    description: str

