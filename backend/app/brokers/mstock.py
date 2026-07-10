from app.auth.auth_service import auth_service
from app.brokers.base import BaseBroker


class MStockBroker(BaseBroker):
    """
    m.Stock broker implementation.
    """

    def login(self):
        return auth_service.login()

    # ---------- Market ----------

    def get_ltp(self, symbol: str):
        return auth_service.client.get_ltp([symbol]).json()

    def get_ohlc(self, symbol: str):
        return auth_service.client.get_ohlc([symbol]).json()

    def get_instruments(self):
        return auth_service.client.get_instruments()

    # ---------- Portfolio ----------

    def get_positions(self):
        return auth_service.client.get_positions().json()

    def get_orders(self):
        return auth_service.client.get_order_book().json()

    # ---------- Orders ----------

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
        price=0,
        trigger_price=0,
        disclosed_quantity=0,
        tag="",
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


broker = MStockBroker()