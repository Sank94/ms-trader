from app.auth.auth_service import auth_service


class OrderService:
    """
    Service for retrieving order-related information.
    """

    def get_order_book(self):
        response = auth_service.client.get_order_book()
        return response.json()


order_service = OrderService()