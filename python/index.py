from contextlib import asynccontextmanager
from urllib.request import Request

import uvicorn
from fastapi import FastAPI
from prisma import Prisma
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from uvicorn import logging

from config.index import settings
from routes.index import router
from utils.env import environment

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
prisma = Prisma(auto_register=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def prisma_starter():
    if not prisma.is_connected():
        await prisma.connect()

    yield

    if prisma.is_connected():
        await prisma.disconnect()


class PanicHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
        except Exception as e:
            return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
        return response


app.add_middleware(PanicHandlerMiddleware)


app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("index:app", port=environment.port, host=settings.APP_HOST, reload=True)
