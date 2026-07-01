from fastapi import APIRouter

from app.auth.auth_service import auth_service

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
def login():
    response = auth_service.login()

    try:
        return response.json()
    except Exception:
        return {
            "status_code": response.status_code,
            "text": response.text,
        }