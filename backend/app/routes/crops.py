"""
Crop Market Prices & Mandi Comparison API
=========================================
Endpoints for verified real-time mandi prices and spatial market comparisons.
"""

from fastapi import APIRouter, Query
from typing import Optional

from app import schemas
from app.pipelines.crop_price_pipeline import CropPricePipeline

router = APIRouter(prefix="/crops", tags=["crops"])

@router.get("/prices", response_model=schemas.CropPriceCompareResponse)
def get_crop_prices(
    crop: str = Query("Wheat", description="Crop name (e.g. Wheat, Rice, Cotton, Maize, Mustard, Sugarcane)"),
    state: Optional[str] = Query(None, description="State name for mandi filtering")
):
    """
    Verified Mandi Prices & Regional Comparison:
    Provides primary APMC mandi modal prices, arrival volumes, nearby mandis, and net arbitrage advice.
    """
    return CropPricePipeline.get_crop_market_comparison(crop=crop, state=state)

@router.get("/compare", response_model=schemas.CropPriceCompareResponse)
def compare_crop_markets(
    crop: str = Query("Wheat", description="Crop name"),
    state: Optional[str] = Query(None)
):
    """Alias endpoint for regional mandi comparison."""
    return CropPricePipeline.get_crop_market_comparison(crop=crop, state=state)
