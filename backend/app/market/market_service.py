from app.auth.auth_service import auth_service


class MarketService:
    def get_ltp(self, symbol: str):
        return auth_service.client.get_ltp([symbol]).json()

    def get_ohlc(self, symbol: str):
        return auth_service.client.get_ohlc([symbol]).json()

    def get_historical_chart(
        self,
        segment: str,
        security_token: int,
        interval: str,
        from_date: str,
        to_date: str,
    ):
        return auth_service.client.get_historical_data(
            segment=segment,
            security_token=security_token,
            interval=interval,
            from_date=from_date,
            to_date=to_date,
        )

    def get_quote(self, symbol: str):
        return auth_service.client.get_quote([symbol]).json()

    def get_index_ltp(self):
        symbols = [
            "NSE:NIFTY BANK",
            "BSE:SENSEX",
            "NSE:INDIA VIX",
        ]

        results = {}

        for symbol in symbols:
            try:
                results[symbol] = auth_service.client.get_ltp([symbol]).json()
            except Exception as e:
                results[symbol] = {
                    "error": str(e)
                }

        return results


market_service = MarketService()