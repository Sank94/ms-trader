from app.orders.order_service import order_service
from app.portfolio.portfolio_service import portfolio_service


class DashboardService:
    def get_dashboard(self):
        funds = portfolio_service.get_funds()
        positions = portfolio_service.get_positions()
        orders = order_service.get_order_book()

        available_balance = (
            funds.get("data", [{}])[0].get("AVAILABLE_BALANCE", "0")
        )

        net_positions = positions.get("data", {}).get("net") or []

        open_positions = len(
            [position for position in net_positions if position["quantity"] != 0]
        )

        open_orders = len(
            [
                order
                for order in (orders.get("data") or [])
                if order["status"] == "Pending"
            ]
        )

        todays_pnl = sum(
            position.get("pnl", 0)
            for position in net_positions
        )

        return {
            "status": "success",
            "data": {
                "available_balance": available_balance,
                "open_positions": open_positions,
                "open_orders": open_orders,
                "todays_pnl": todays_pnl,
            },
        }


dashboard_service = DashboardService()