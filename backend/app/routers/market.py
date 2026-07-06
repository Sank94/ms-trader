from fastapi import APIRouter

from app.market.market_service import market_service

router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


@router.get("/ltp")
def get_ltp(symbol: str):
    """
    Get the latest traded price (LTP) for a market instrument.

    Example:
        /market/ltp?symbol=NSE:ACC-EQ
    """
    return market_service.get_ltp(symbol)


@router.get("/ohlc")
def get_ohlc(symbol: str):
    """
    Get the Open, High, Low and Close (OHLC) for a market instrument.

    Example:
        /market/ohlc?symbol=NSE:ACC-EQ
    """
    return market_service.get_ohlc(symbol)