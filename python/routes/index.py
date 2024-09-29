from fastapi import APIRouter
from python.routes.auth.login import router as login
from python.config.index import settings

router = APIRouter(
    prefix=settings.ROUTE_PREFIX
)

router.include_router(login)