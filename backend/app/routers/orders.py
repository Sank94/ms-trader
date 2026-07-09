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


@router.post("/place")
def place_order(
    variety: str,
    tradingsymbol: str,
    exchange: str,
    transaction_type: str,
    order_type: str,
    quantity: int,
    product: str,
    validity: str,
    price: float = 0,
    trigger_price: float = 0,
    disclosed_quantity: int = 0,
    tag: str = "",
):
    return order_service.place_order(
        variety,
        tradingsymbol,
        exchange,
        transaction_type,
        order_type,
        quantity,
        product,
        validity,
        price,
        trigger_price,
        disclosed_quantity,
        tag,
    )