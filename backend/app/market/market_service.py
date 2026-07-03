from app.auth.auth_service import auth_service


class MarketService:
    def get_ltp(self, symbol: str):
        """
        Fetch the latest traded price (LTP) for a market instrument.

        Example:
            NSE:ACC-EQ
        """
        response = auth_service.client.get_ltp([symbol])

        return response.json()


market_service = MarketService()