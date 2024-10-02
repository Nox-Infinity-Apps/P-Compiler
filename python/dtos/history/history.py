from dataclasses import dataclass
from datetime import datetime
from typing import Union


@dataclass
class HistoryData:
    id: str
    date: str
    title: str
    status: str
    time: str
    capacity: str
    compiler: str