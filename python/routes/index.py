from fastapi import APIRouter
from routes.auth.login import router as login
from routes.course.course import router as course
from config.index import settings
from routes.gemini.gemini import router as gemini
from routes.question.question import router as question
from routes.history.history import router as history
from routes.user.user import router as user
from routes.compile.compile import router as compile
router = APIRouter(
    prefix=settings.ROUTE_PREFIX
)

router.include_router(login)
router.include_router(course)
router.include_router(question)
router.include_router(gemini)
router.include_router(history)
router.include_router(user)

router.include_router(compile)