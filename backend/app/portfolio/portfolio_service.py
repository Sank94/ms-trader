from app.auth.auth_service import auth_service


class PortfolioService:
    """
    Service for retrieving portfolio-related information.
    """

    def get_holdings(self):
        response = auth_service.client.get_holdings()
        return response.json()

    def get_positions(self):
        response = auth_service.client.get_net_position()
        return response.json()

    def get_funds(self):
        response = auth_service.client.get_fund_summary()
        return response.json()


portfolio_service = PortfolioService()