from datetime import date

from app.core.config import settings
from app.session.session_manager import session_manager
from app.instruments.instrument_service import instrument_service


class MarketStream:
    NIFTY_TOKEN = 26000
    BANK_NIFTY_TOKEN = 26009
    SENSEX_TOKEN = 51
    INDIA_VIX_TOKEN = 26017

    INDEX_TOKENS = [
        NIFTY_TOKEN,
        BANK_NIFTY_TOKEN,
        SENSEX_TOKEN,
        INDIA_VIX_TOKEN,
    ]

    OPTION_RANGE = 10
    NIFTY_STRIKE_STEP = 50

    def __init__(self):
        self.ticker = None
        self.connected = False
        self.clients = set()
        self.event_loop = None

        self.nifty_option_tokens = set()
        self.option_metadata = {}

    def set_event_loop(self, loop):
        self.event_loop = loop

    def add_client(self, websocket):
        self.clients.add(websocket)
        print(f"Falcon client connected. Clients: {len(self.clients)}")

    def remove_client(self, websocket):
        self.clients.discard(websocket)
        print(f"Falcon client disconnected. Clients: {len(self.clients)}")

    async def broadcast_tick(self, tick):
        disconnected = set()

        for client in list(self.clients):
            try:
                await client.send_json(tick)
            except Exception as e:
                print(f"Failed to send tick to Falcon: {e}")
                disconnected.add(client)

        for client in disconnected:
            self.clients.discard(client)

    def start(self):
        from tradingapi_a.__config__ import mticker_url
        from tradingapi_a.mticker import MTicker

        if self.ticker:
            print("Market stream already running.")
            return

        if not session_manager.access_token:
            raise RuntimeError("No authenticated session found.")

        print("Creating m.Stock WebSocket...")

        self.ticker = MTicker(
            api_key=settings.MSTOCK_API_KEY,
            access_token=session_manager.access_token,
            root=mticker_url,
            debug=False,
            reconnect=True,
        )

        self.ticker.on_connect = self.on_connect
        self.ticker.on_open = self.on_open
        self.ticker.on_ticks = self.on_ticks
        self.ticker.on_error = self.on_error
        self.ticker.on_close = self.on_close

        print("Starting Market Stream...")

        self.ticker.connect(threaded=True)

    def on_connect(self, ws, response):
        print("m.Stock WebSocket connected")
        self.connected = True

        try:
            self.ticker.send_login_after_connect()
            print("m.Stock WebSocket login sent")
        except Exception as e:
            print(f"WebSocket login failed: {e}")

    def on_open(self, ws):
        print("m.Stock WebSocket opened")

        try:
            self.subscribe_indices()
            self.subscribe_nifty_options()

        except Exception as e:
            print(f"Market subscription error: {e}")

    def subscribe_indices(self):
        self.ticker.subscribe(self.INDEX_TOKENS)

        self.ticker.set_mode(
            self.ticker.MODE_LTP,
            self.INDEX_TOKENS,
        )

        print(
            "Subscribed: "
            "NIFTY 50, BANK NIFTY, SENSEX, INDIA VIX"
        )

    def get_nifty_options(self):
        instrument_service.load()

        today = date.today().isoformat()

        options = [
            instrument
            for instrument in instrument_service.instruments
            if instrument.get("exchange") == "NFO"
            and instrument.get("segment") == "OPTIDX"
            and instrument.get("name", "").upper() == "NIFTY"
            and instrument.get("expiry") == today
            and instrument.get("instrument_type") in ["CE", "PE"]
        ]

        if not options:
            raise RuntimeError(
                f"No NIFTY options found for expiry {today}"
            )

        return options

    def subscribe_nifty_options(self):
        options = self.get_nifty_options()

        # Current NIFTY is around 24,200.
        # We initially use 24,200 as ATM.
        #
        # The next step will make this automatically follow
        # the live NIFTY price.

        atm = 24200

        strikes = [
            atm + (i * self.NIFTY_STRIKE_STEP)
            for i in range(
                -self.OPTION_RANGE,
                self.OPTION_RANGE + 1,
            )
        ]

        selected = [
            option
            for option in options
            if float(option.get("strike", 0)) in strikes
        ]

        tokens = []

        for option in selected:
            token = int(option["instrument_token"])

            tokens.append(token)

            self.nifty_option_tokens.add(token)

            self.option_metadata[token] = {
                "symbol": option["tradingsymbol"],
                "strike": float(option["strike"]),
                "option_type": option["instrument_type"],
                "expiry": option["expiry"],
                "lot_size": int(option["lot_size"]),
            }

        if not tokens:
            raise RuntimeError(
                "No NIFTY option contracts found "
                "for the selected strikes."
            )

        self.ticker.subscribe(tokens)

        self.ticker.set_mode(
            self.ticker.MODE_QUOTE,
            tokens,
        )

        print(
            f"Subscribed to {len(tokens)} NIFTY option contracts"
        )

        print(
            f"Strike range: {min(strikes)} - {max(strikes)}"
        )

    def on_ticks(self, ws, ticks):
        for tick in ticks:
            token = tick.get("instrument_token")

            try:
                token = int(token)
            except (TypeError, ValueError):
                pass

            if token == self.NIFTY_TOKEN:
                name = "NIFTY 50"

            elif token == self.BANK_NIFTY_TOKEN:
                name = "BANK NIFTY"

            elif token == self.SENSEX_TOKEN:
                name = "SENSEX"

            elif token == self.INDIA_VIX_TOKEN:
                name = "INDIA VIX"

            elif token in self.nifty_option_tokens:
                metadata = self.option_metadata.get(token, {})

                name = metadata.get(
                    "symbol",
                    f"OPTION {token}",
                )

            else:
                name = str(token)

            print(
                f"{name} | "
                f"price={tick.get('last_price')} | "
                f"token={token}"
            )

            # Attach our option metadata so the frontend
            # can immediately identify the contract.
            if token in self.option_metadata:
                tick["option"] = self.option_metadata[token]

            if self.event_loop and self.clients:
                import asyncio

                asyncio.run_coroutine_threadsafe(
                    self.broadcast_tick(tick),
                    self.event_loop,
                )

    def on_error(self, ws, code, reason):
        print(
            f"m.Stock WebSocket ERROR: "
            f"code={code}, reason={reason}"
        )

    def on_close(self, ws, code, reason):
        print(
            f"m.Stock WebSocket CLOSED: "
            f"code={code}, reason={reason}"
        )

        self.connected = False

    def stop(self):
        if self.ticker:
            try:
                self.ticker.close()
            except Exception as e:
                print(
                    f"Error closing Market Stream: {e}"
                )

        self.ticker = None
        self.connected = False


market_stream = MarketStream()