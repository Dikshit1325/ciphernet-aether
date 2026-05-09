from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class URLRequest(BaseModel):
    """Request schema for URL analysis"""
    url: str

class ThreatResponse(BaseModel):
    """Threat data stored in system"""
    id: str
    url: str
    trust_score: int
    threat_level: str  # HIGH, MEDIUM, LOW
    timestamp: datetime
    category: str  # Phishing, Malware, Scam, Typosquat, etc.
    phishing_probability: int
    risk_factors: List[str]
    ai_explanation: Optional[str] = None

class StatsResponse(BaseModel):
    """Dashboard statistics"""
    sites_scanned: int
    threats_blocked: int
    trackers_stopped: int
    avg_trust_score: float
    threats_by_level: dict  # {HIGH: 5, MEDIUM: 3, LOW: 2}
    threats_by_category: dict  # {Phishing: 4, Malware: 2, ...}

class ThreatsListResponse(BaseModel):
    """List of recent threats"""
    threats: List[ThreatResponse]
    total_count: int
    high_count: int
    medium_count: int
    low_count: int
