from fastapi import APIRouter

router = APIRouter(
    prefix="/auth"
)


@router.get("/login")
async def login():
    return {"message": "hi"}
