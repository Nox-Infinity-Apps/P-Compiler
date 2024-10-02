from fastapi import APIRouter
from routes.auth.login import router as login
from routes.course.course import router as course
from config.index import settings
from routes.question.question import router as question
from routes.history.history import router as history

router = APIRouter(
    prefix=settings.ROUTE_PREFIX
)

router.include_router(login)
router.include_router(course)
router.include_router(question)
router.include_router(history)
