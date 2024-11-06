from typing import List, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class CompileBody(BaseModel):
    source_code: str
    inputs: List[str]
    outputs: List[str]

class CompileResponse(BaseModel):
    std_out: List[str]
    std_err: List[str]
    time:List[str]
    result:  List[bool]
    description: List[str]