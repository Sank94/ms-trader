from fastapi import APIRouter

from app.dashboard.dashboard_service import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def get_dashboard():
    """
    Get dashboard data.

    Combines:
    - Funds
    - Positions
    - Orders
    """
    return dashboard_service.get_dashboard()