from typing import Generic, TypeVar, Literal
from starlette import status
from starlette.responses import JSONResponse
from pydantic import BaseModel

T = TypeVar('T')


class BaseResponse(BaseModel):
    status: Literal['failed', 'success']


class SuccessResponse(Generic[T], BaseResponse):
    message: str
    data: T
    status: Literal['success'] = 'success'


class BadRequestResponse(BaseResponse):
    message: str
    code: str = '0'
    status: Literal['failed'] = 'failed'


class FailedResponse(BaseResponse):
    message: str
    status: Literal['failed'] = 'failed'


def Success[T](message: str, data: T) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=SuccessResponse(
            message=message,
            data=data
        ).dict()
    )


def Created[T](message: str, data: T) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=SuccessResponse(
            message=message,
            data=data
        ).dict()
    )


def Unauthorized(message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content=FailedResponse(message=message).dict()
    )


def BadRequest(message: str, code: str) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=BadRequestResponse(message=message, code=code).dict()
    )


def Failed(message: str) -> JSONResponse:
    return JSONResponse(
        content=FailedResponse(message=message).dict(),
        status_code=status.HTTP_200_OK
    )
