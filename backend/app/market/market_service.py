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

    def get_ohlc(self, symbol: str):
        """
        Fetch the Open, High, Low and Close (OHLC) for a market instrument.

        Example:
            NSE:ACC-EQ
        """
        response = auth_service.client.get_ohlc([symbol])
        return response.json()

    def get_historical_chart(
        self,
        segment: str,
        security_token: int,
        interval: str,
        from_date: str,
        to_date: str,
    ):
        """
        Fetch historical OHLCV candle data.

        Example:
            Segment: NSE
            Security Token: 22
            Interval: day
            From Date: 2026-07-01
            To Date: 2026-07-06
        """
        response = auth_service.client.get_historical_chart(
            segment,
            security_token,
            interval,
            from_date,
            to_date,
        )
        return response.json()


market_service = MarketService()