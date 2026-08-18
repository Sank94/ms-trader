from tradingapi_a.exceptions import InputException

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
        print("\n========== ORDER REQUEST ==========")
        print(f"Variety            : {variety}")
        print(f"Trading Symbol     : {tradingsymbol}")
        print(f"Exchange           : {exchange}")
        print(f"Transaction Type   : {transaction_type}")
        print(f"Order Type         : {order_type}")
        print(f"Quantity           : {quantity}")
        print(f"Product            : {product}")
        print(f"Validity           : {validity}")
        print(f"Price              : {price}")
        print(f"Trigger Price      : {trigger_price}")
        print(f"Disclosed Quantity : {disclosed_quantity}")
        print(f"Tag                : {tag}")
        print("===================================\n")

        try:
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

            print("========== ORDER RESPONSE ==========")
            print(response.status_code)
            print(response.text)
            print("====================================\n")

            return response.json()

        except InputException as e:
            print("========== ORDER ERROR ==========")
            print(str(e))
            print("=================================\n")

            return {
                "success": False,
                "error": str(e),
            }


broker = MStockBroker()