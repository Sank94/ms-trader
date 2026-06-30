from fastapi import FastAPI

from app.core.config import settings
from app.routers.health import router as health_router
from app.routers.config import router as config_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(health_router)
app.include_router(config_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Falcon Trading Terminal"
    }