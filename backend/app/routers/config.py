from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/config", tags=["Configuration"])


@router.get("/check")
def check_config():
    return {
        "app": settings.APP_NAME,
        "api_key_loaded": bool(settings.MSTOCK_API_KEY),
        "username_loaded": bool(settings.MSTOCK_USERNAME),
        "password_loaded": bool(settings.MSTOCK_PASSWORD),
    }