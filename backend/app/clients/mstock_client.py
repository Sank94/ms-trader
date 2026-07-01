import httpx

from app.core.config import settings


class MStockClient:
    BASE_URL = "https://api.mstock.trade/openapi/typea"

    def __init__(self):
        self.client = httpx.Client(
            base_url=self.BASE_URL,
            headers={
                "X-Mirae-Version": "1",
            },
            timeout=30.0,
        )

    def login(self):
        response = self.client.post(
            "/connect/login",
            data={
                "username": settings.MSTOCK_USERNAME,
                "password": settings.MSTOCK_PASSWORD,
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
        )

        return response

    def close(self):
        self.client.close()


mstock = MStockClient()