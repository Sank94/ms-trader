from app.auth.auth_service import auth_service


class OrderService:
    """
    Service for retrieving and placing orders.
    """

    def get_order_book(self):
        response = auth_service.client.get_order_book()
        return response.json()

    def get_trade_book(self):
        response = auth_service.client.get_trade_book()
        return response.json()

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
        response = auth_service.client.place_order(
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

        return response.json()


order_service = OrderService()