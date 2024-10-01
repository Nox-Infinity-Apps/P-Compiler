from fastapi import APIRouter
from routes.auth.login import router as login
from config.index import settings

router = APIRouter(
    prefix=settings.ROUTE_PREFIX
)

router.include_router(login)