from fastapi import APIRouter
from app.schemas.zero_trust_schema import AccessRequest, AccessResponse
from app.services.zero_trust_service import evaluate_access_request

router = APIRouter(prefix="/api/zero-trust", tags=["Zero Trust"])

@router.post("/simulate-access", response_model=AccessResponse)
async def simulate_access(request: AccessRequest):
    return evaluate_access_request(request)
