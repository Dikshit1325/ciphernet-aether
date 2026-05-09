"""
URL Analysis Routes
Handles URL analysis requests and threat data endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

from app.services.url_analyzer import analyze_url as analyze_url_service
from app.services.threat_storage import (
    store_threat,
    get_recent_threats,
    get_all_threats,
    calculate_stats,
    clear_threats
)
from app.schemas.urls_schema import (
    URLRequest,
    ThreatResponse,
    StatsResponse,
    ThreatsListResponse
)

router = APIRouter()

class AnalyzeURLResponse(BaseModel):
    """Response from URL analysis"""
    url: str
    trust_score: int
    threat_level: str
    phishing_probability: int
    risk_factors: List[str]
    ai_explanation: str
    category: str
    threat_id: str

@router.post("/analyze-url", response_model=AnalyzeURLResponse)
async def analyze_url(data: URLRequest):
    """
    Analyze a URL for threats
    
    - Detects phishing patterns
    - Calculates trust score
    - Stores threat data if detected
    
    Args:
        data: URLRequest with url field
    
    Returns:
        Analysis result with threat info
    """
    try:
        # Validate URL
        if not data.url or len(data.url) < 3:
            raise ValueError("Invalid URL provided")
        
        # Analyze URL using existing analyzer
        analysis = analyze_url_service(data.url)
        
        # Store threat if detected (trust_score < 80 means some risk)
        if analysis["trust_score"] < 80:
            stored_threat = store_threat(
                url=data.url,
                trust_score=analysis["trust_score"],
                threat_level=analysis["threat_level"],
                phishing_probability=analysis["phishing_probability"],
                risk_factors=analysis["risk_factors"],
                ai_explanation=analysis["ai_explanation"]
            )
            threat_id = stored_threat["id"]
        else:
            # Even safe URLs get a temporary threat ID for tracking
            threat_id = "safe-" + data.url.split("//")[-1].split("/")[0][:8]
        
        return AnalyzeURLResponse(
            url=data.url,
            trust_score=analysis["trust_score"],
            threat_level=analysis["threat_level"],
            phishing_probability=analysis["phishing_probability"],
            risk_factors=analysis["risk_factors"],
            ai_explanation=analysis["ai_explanation"],
            category=analysis.get("category", "Unknown"),
            threat_id=threat_id
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="URL analysis failed")

@router.get("/threats", response_model=ThreatsListResponse)
async def get_threats(limit: int = 20):
    """
    Get recent detected threats
    
    Args:
        limit: Number of threats to return (default 20, max 100)
    
    Returns:
        List of recent threats with statistics
    """
    limit = min(limit, 100)
    threats = get_recent_threats(limit)
    
    # Count by threat level
    high = sum(1 for t in threats if t["threat_level"] == "HIGH")
    medium = sum(1 for t in threats if t["threat_level"] == "MEDIUM")
    low = sum(1 for t in threats if t["threat_level"] == "LOW")
    
    return ThreatsListResponse(
        threats=[
            ThreatResponse(
                id=t["id"],
                url=t["url"],
                trust_score=t["trust_score"],
                threat_level=t["threat_level"],
                timestamp=datetime.fromisoformat(t["timestamp"]),
                category=t["category"],
                phishing_probability=t["phishing_probability"],
                risk_factors=t["risk_factors"],
                ai_explanation=t["ai_explanation"]
            )
            for t in threats
        ],
        total_count=len(get_all_threats()),
        high_count=high,
        medium_count=medium,
        low_count=low
    )

@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """
    Get dashboard statistics
    
    Returns:
        Stats including sites scanned, threats blocked, avg trust, etc.
    """
    stats = calculate_stats()
    return StatsResponse(**stats)

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    threats_count = len(get_all_threats())
    return {
        "status": "healthy",
        "threats_stored": threats_count,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/debug/clear-threats")
async def debug_clear_threats():
    """Debug endpoint to clear all threats (development only)"""
    clear_threats()
    return {"status": "threats cleared", "message": "All threats have been removed"}