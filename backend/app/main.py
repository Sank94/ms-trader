import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.health import router as health_router
from app.routers.config import router as config_router
from app.routers.auth import router as auth_router
from app.routers.market import router as market_router
from app.routers.portfolio import router as portfolio_router
from app.routers.orders import router as orders_router
from app.routers.dashboard import router as dashboard_router
from app.routers.instruments import router as instruments_router
from app.market.market_stream import market_stream


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(config_router)
app.include_router(auth_router)
app.include_router(market_router)
app.include_router(portfolio_router)
app.include_router(orders_router)
app.include_router(dashboard_router)
app.include_router(instruments_router)


@app.on_event("startup")
async def startup_event():
    market_stream.set_event_loop(asyncio.get_running_loop())


@app.get("/")
def root():
    return {
        "message": "Welcome to Falcon Trading Terminal"
    }


@app.websocket("/ws/market")
async def market_websocket(websocket: WebSocket):
    await websocket.accept()

    market_stream.add_client(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        market_stream.remove_client(websocket)

    except Exception:
        market_stream.remove_client(websocket)