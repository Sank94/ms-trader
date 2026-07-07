from app.orders.order_service import order_service
from app.portfolio.portfolio_service import portfolio_service


class DashboardService:
    def get_dashboard(self):
        """
        Fetch dashboard data by combining
        portfolio and order information.
        """

        funds = portfolio_service.get_funds()
        positions = portfolio_service.get_positions()
        orders = order_service.get_order_book()

        return {
            "status": "success",
            "data": {
                "funds": funds.get("data"),
                "positions": positions.get("data"),
                "orders": orders.get("data"),
            },
        }


dashboard_service = DashboardService()