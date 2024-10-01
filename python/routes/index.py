from fastapi import APIRouter
from routes.auth.login import router as login
from config.index import settings
from routes.question.question import router as question

router = APIRouter(
    prefix=settings.ROUTE_PREFIX
)

router.include_router(login)
router.include_router(question)
