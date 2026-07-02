from tradingapi_a.mconnect import MConnect

from app.core.config import settings
from app.session.session_manager import session_manager


class AuthService:
    def __init__(self):
        self.client = MConnect(api_key=settings.MSTOCK_API_KEY)

    def login(self):
        """
        Login using the m.Stock Client ID and Password.
        """
        return self.client.login(
            settings.MSTOCK_USERNAME,
            settings.MSTOCK_PASSWORD,
        )

    def verify_totp(self, totp: str):
        """
        Verify the TOTP code and store the authenticated session.
        """
        response = self.client.verify_totp(
            settings.MSTOCK_API_KEY,
            totp,
        )

        if response.status_code == 200:
            data = response.json()["data"]

            session_manager.access_token = data.get("access_token")
            session_manager.refresh_token = data.get("refresh_token")
            session_manager.public_token = data.get("public_token")
            session_manager.user_name = data.get("user_name")
            session_manager.user_id = data.get("user_id")
            session_manager.login_time = data.get("login_time")

        return response


auth_service = AuthService()