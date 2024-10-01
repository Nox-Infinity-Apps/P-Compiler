from dataclasses import dataclass
from pydantic import BaseModel

from models.base.error import CommonError


@dataclass
class BaseResponse(BaseModel):
    error: CommonError
    data: any


def to_response(err, data):
    return BaseResponse(err, data)
