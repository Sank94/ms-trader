import csv
import io

from app.auth.auth_service import auth_service


class InstrumentService:
    def __init__(self):
        self.instruments = []
        self.loaded = False

    def load(self):
        if self.loaded:
            return

        data = auth_service.client.get_instruments()

        text = data.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text))

        self.instruments = list(reader)
        self.loaded = True

        print(f"Loaded {len(self.instruments)} instruments.")

    def search(self, query: str, limit: int = 20):
        self.load()

        query = query.upper().strip()

        results = []

        for instrument in self.instruments:
            tradingsymbol = instrument.get("tradingsymbol", "")
            name = instrument.get("name", "")
            exchange = instrument.get("exchange", "")

            if exchange != "NSE":
                continue

            if (
                query in tradingsymbol.upper()
                or query in name.upper()
            ):
                results.append(
                    {
                        "tradingsymbol": tradingsymbol,
                        "name": name,
                        "exchange": exchange,
                        "instrument_token": instrument.get("instrument_token"),
                        "exchange_token": instrument.get("exchange_token"),
                        "symbol": instrument.get("symbol"),
                        "isin": instrument.get("isin"),
                        "segment": instrument.get("segment"),
                    }
                )

            if len(results) >= limit:
                break

        return results

    def get_by_symbol(self, symbol: str):
        self.load()

        symbol = symbol.upper().strip()

        for instrument in self.instruments:
            if (
                instrument.get("exchange") == "NSE"
                and instrument.get("tradingsymbol", "").upper() == symbol
            ):
                return instrument

        return None


instrument_service = InstrumentService()