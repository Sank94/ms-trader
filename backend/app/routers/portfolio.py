from fastapi import APIRouter

from app.portfolio.portfolio_service import portfolio_service

router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


@router.get("/holdings")
def get_holdings():
    return portfolio_service.get_holdings()


@router.get("/positions")
def get_positions():
    return portfolio_service.get_positions()


@router.get("/funds")
def get_funds():
    return portfolio_service.get_funds()