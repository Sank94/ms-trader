from app.brokers.mstock import broker


class OrderService:
    """
    Service for retrieving and placing orders.
    """

    def get_order_book(self):
        return broker.get_orders()

    def get_trade_book(self):
        return broker.get_orders()

    def place_order(
        self,
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
    ):
        return broker.place_order(
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


order_service = OrderService()