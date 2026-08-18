from fastapi import APIRouter

from app.market.market_service import market_service


router = APIRouter(
    prefix="/market",
    tags=["Market"],
)


@router.get("/ltp")
def get_ltp(symbol: str):
    return market_service.get_ltp(symbol)


@router.get("/ohlc")
def get_ohlc(symbol: str):
    return market_service.get_ohlc(symbol)


@router.get("/history")
def get_historical_chart(
    segment: str,
    security_token: int,
    interval: str,
    from_date: str,
    to_date: str,
):
    return market_service.get_historical_chart(
        segment,
        security_token,
        interval,
        from_date,
        to_date,
    )


@router.get("/quote")
def get_quote(symbol: str):
    return market_service.get_quote(symbol)


@router.get("/index-ltp")
def get_index_ltp():
    return market_service.get_index_ltp()