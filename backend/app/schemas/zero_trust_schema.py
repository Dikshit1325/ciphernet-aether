from pydantic import BaseModel
from typing import List

class AccessRequest(BaseModel):
    employee: str
    role: str
    device: str
    location: str
    ip_address: str
    login_time: str
    vpn_enabled: bool
    admin_request: bool
    mfa_enabled: bool
    telemetry_anomaly_score: int = 0

class AccessResponse(BaseModel):
    risk_score: int
    decision: str
    threat_level: str
    device_trust: int
    session_trust: int
    ai_confidence: int
    reasons: List[str]
    recommendations: List[str]
