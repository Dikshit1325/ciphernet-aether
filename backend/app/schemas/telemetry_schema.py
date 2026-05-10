from pydantic import BaseModel
from typing import List, Optional

class TelemetryRequest(BaseModel):
    url: str
    hostname: str
    browserTitle: str
    redirectDepth: int = 0
    suspiciousKeywords: List[str] = []
    browsingPattern: str = "normal"

class TelemetryResponse(BaseModel):
    trustScore: int
    phishingRisk: int
    manipulationScore: int
    anomalyScore: int
    threatLevel: str
    riskFactors: List[str]
    aiReasoning: str
    domainEntropy: float
    redirectDepth: int
    suspiciousKeywords: List[str]
    browsingPattern: str
