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

@dataclass
class RankData:
    stt : str
    image : str
    account : str
    userFirstName : str
    userLastName : str
    course : str
    class_ : str
    ac : str
    tried : str


