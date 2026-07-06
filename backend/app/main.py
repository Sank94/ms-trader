from fastapi import FastAPI

from app.core.config import settings
from app.routers.health import router as health_router
from app.routers.config import router as config_router
from app.routers.auth import router as auth_router
from app.routers.market import router as market_router
from app.routers.portfolio import router as portfolio_router
from app.routers.orders import router as orders_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(health_router)
app.include_router(config_router)
app.include_router(auth_router)
app.include_router(market_router)
app.include_router(portfolio_router)
app.include_router(orders_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Falcon Trading Terminal"
    }