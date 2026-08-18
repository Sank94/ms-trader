from fastapi import APIRouter
from pydantic import BaseModel

from app.auth.auth_service import auth_service
from app.market.market_stream import market_stream


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

    # Start the live market stream after successful login
    if response.status_code == 200:
        try:
            market_stream.start()
        except Exception as e:
            print(f"Failed to start Market Stream: {e}")

    return response.json()