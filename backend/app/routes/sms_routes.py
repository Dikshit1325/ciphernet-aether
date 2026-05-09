from fastapi import APIRouter
from pydantic import BaseModel
from app.services.sms_analyzer import analyze_sms

router = APIRouter()

class SMSRequest(BaseModel):
    message: str

@router.post("/analyze-sms")
def analyze(request: SMSRequest):
    return analyze_sms(request.message)