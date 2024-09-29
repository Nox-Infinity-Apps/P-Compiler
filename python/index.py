import uvicorn
from fastapi import FastAPI

from python.config.index import settings
from python.routes.index import router


app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=settings.APP_PORT, host=settings.APP_HOST, reload=True)

