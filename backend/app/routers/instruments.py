from fastapi import APIRouter

from app.instruments.instrument_service import instrument_service

router = APIRouter(
    prefix="/instruments",
    tags=["Instruments"],
)


@router.get("/search")
def search_instruments(query: str):
    """
    Search instruments by trading symbol or company name.

    Example:
        /instruments/search?query=reliance
    """
    return instrument_service.search(query)