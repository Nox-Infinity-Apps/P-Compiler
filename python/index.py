from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from prisma import Prisma

from config.index import settings
from routes.index import router
from utils.env import environment

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
prisma = Prisma(auto_register=False)


@asynccontextmanager
async def prisma_starter():

    if not prisma.is_connected():
        await prisma.connect()

    yield

    if prisma.is_connected():
        await prisma.disconnect()


app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("index:app", port=environment.port, host=settings.APP_HOST, reload=True)
