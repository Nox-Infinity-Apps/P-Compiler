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

@dataclass
class SubmissionStatistics:
    total_submissions: int
    total_ac: int
    ac_percentage: float
    total_non_ac: int
    total_wa: int
    wa_percentage: float
    total_tle: int
    tle_percentage: float
    total_ir: int
    ir_percentage: float
    total_rte: int
    rte_percentage: float



