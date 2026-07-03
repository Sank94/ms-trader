from fastapi import APIRouter
from pydantic import BaseModel

from app.auth.auth_service import auth_service


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class TOTPRequest(BaseModel):
    totp: str


@router.post("/login")
def login():
    response = auth_service.login()
    return response.json()


@router.post("/verify-totp")
def verify_totp(request: TOTPRequest):
    response = auth_service.verify_totp(request.totp)
    return response.json()