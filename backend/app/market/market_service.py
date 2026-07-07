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
        """
        response = auth_service.client.get_historical_chart(
            segment,
            security_token,
            interval,
            from_date,
            to_date,
        )
        return response.json()

    def get_quote(self, symbol: str):
        """
        Fetch a consolidated market quote.

        Combines:
        - Last Traded Price (LTP)
        - Open
        - High
        - Low
        - Close
        """

        ltp_response = auth_service.client.get_ltp([symbol]).json()
        ohlc_response = auth_service.client.get_ohlc([symbol]).json()

        ltp_data = ltp_response["data"][symbol]
        ohlc_data = ohlc_response["data"][symbol]

        return {
            "status": "success",
            "data": {
                "symbol": symbol,
                "instrument_token": ltp_data["instrument_token"],
                "last_price": ltp_data["last_price"],
                "open": ohlc_data["ohlc"]["open"],
                "high": ohlc_data["ohlc"]["high"],
                "low": ohlc_data["ohlc"]["low"],
                "close": ohlc_data["ohlc"]["close"],
            },
        }


market_service = MarketService()