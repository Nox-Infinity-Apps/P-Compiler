import uvicorn
from fastapi import FastAPI
from prisma import Prisma

from config.index import settings
from routes.index import router

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
prisma = Prisma(auto_register=True)


@app.on_event('startup')
async def startup() -> None:
    await prisma.connect()


@app.on_event('shutdown')
async def shutdown() -> None:
    if prisma.is_connected():
        await prisma.disconnect()


app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=settings.APP_PORT, host=settings.APP_HOST, reload=True)
