from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWTError, decode
from typing import Dict
from pydantic import BaseModel
from starlette import status

from utils.env import environment

SECRET_KEY = environment.jwt_secret
ALGORITHM = "HS256"


class TokenPayload(BaseModel):
    username: str
    cookie: str
    sub: str
    exp: int


bearer_scheme = HTTPBearer()


def parse_jwt(token: HTTPAuthorizationCredentials = Security(bearer_scheme)) -> Dict:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWTError:
        raise credentials_exception
