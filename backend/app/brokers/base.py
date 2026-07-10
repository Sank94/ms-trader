from abc import ABC, abstractmethod


class BaseBroker(ABC):
    """
    Common broker interface used by Falcon.
    """

    # Authentication

    @abstractmethod
    def login(self):
        pass

    # Market

    @abstractmethod
    def get_ltp(self, symbol: str):
        pass

    @abstractmethod
    def get_ohlc(self, symbol: str):
        pass

    @abstractmethod
    def get_instruments(self):
        pass

    # Portfolio

    @abstractmethod
    def get_positions(self):
        pass

    @abstractmethod
    def get_orders(self):
        pass

    # Orders

    @abstractmethod
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
        pass