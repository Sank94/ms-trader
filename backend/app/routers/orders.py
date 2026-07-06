from fastapi import APIRouter

from app.orders.order_service import order_service

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.get("/")
def get_order_book():
    return order_service.get_order_book()


@router.get("/trades")
def get_trade_book():
    return order_service.get_trade_book()