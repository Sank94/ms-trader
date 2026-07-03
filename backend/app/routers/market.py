from fastapi import APIRouter

from app.market.market_service import market_service

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


@router.get("/ltp")
def get_ltp(symbol: str):
    return market_service.get_ltp(symbol)