from fastapi import APIRouter
from app.schemas.telemetry_schema import TelemetryRequest, TelemetryResponse
from app.services.telemetry_service import analyze_telemetry

router = APIRouter()

@router.post("/analyze", response_model=TelemetryResponse)
def analyze_telemetry_endpoint(request: TelemetryRequest):
    return analyze_telemetry(request)
