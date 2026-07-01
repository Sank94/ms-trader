from tradingapi_a.mconnect import MConnect

from app.core.config import settings


class AuthService:
    def __init__(self):
        self.client = MConnect(api_key=settings.MSTOCK_API_KEY)

    def login(self):
        return self.client.login(
            settings.MSTOCK_USERNAME,
            settings.MSTOCK_PASSWORD,
        )


auth_service = AuthService()