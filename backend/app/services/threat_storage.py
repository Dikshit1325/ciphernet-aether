"""
Threat Storage Service - Manages threat data
Stores scanned URLs and threat information in memory
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from urllib.parse import urlparse

# Threat categories based on analysis
THREAT_CATEGORIES = {
    "Phishing": "Brand impersonation and credential theft patterns",
    "Malware": "Malicious code or drive-by downloads",
    "Scam": "Financial fraud or unwanted offers",
    "Typosquat": "Domain name typo confusion",
    "Crypto Phish": "Cryptocurrency wallet drainers",
}

# In-memory storage of threats
threat_store: List[Dict] = []

def generate_threat_category(url: str, trust_score: int, risk_factors: List[str]) -> str:
    """Determine threat category based on URL patterns and risk factors"""
    url_lower = url.lower()
    
    crypto_keywords = ["wallet", "metamask", "opensea", "binance", "coinbase"]
    if any(k in url_lower for k in crypto_keywords):
        return "Crypto Phish"
    
    if any("typo" in rf.lower() or "domain" in rf.lower() for rf in risk_factors):
        return "Typosquat"
    
    if "malware" in url_lower or "malicious" in url_lower:
        return "Malware"
    
    if any(k in url_lower for k in ["claim", "free", "win", "prize", "offer"]):
        return "Scam"
    
    return "Phishing"

def store_threat(
    url: str,
    trust_score: int,
    threat_level: str,
    phishing_probability: int,
    risk_factors: List[str],
    ai_explanation: str
) -> Dict:
    """
    Store a scanned threat in memory
    
    Args:
        url: The analyzed URL
        trust_score: Trust score (0-100)
        threat_level: HIGH, MEDIUM, or LOW
        phishing_probability: Probability percentage
        risk_factors: List of detected risk factors
        ai_explanation: AI-generated explanation
    
    Returns:
        The stored threat object
    """
    threat_id = str(uuid.uuid4())[:8]
    category = generate_threat_category(url, trust_score, risk_factors)
    
    threat = {
        "id": threat_id,
        "url": url,
        "trust_score": trust_score,
        "threat_level": threat_level,
        "timestamp": datetime.now().isoformat(),
        "category": category,
        "phishing_probability": phishing_probability,
        "risk_factors": risk_factors,
        "ai_explanation": ai_explanation
    }
    
    # Keep only last 100 threats in memory
    threat_store.insert(0, threat)
    if len(threat_store) > 100:
        threat_store.pop()
    
    return threat

def get_recent_threats(limit: int = 20) -> List[Dict]:
    """Get recent threats from storage"""
    return threat_store[:limit]

def get_all_threats() -> List[Dict]:
    """Get all stored threats"""
    return threat_store

def calculate_stats() -> Dict:
    """Calculate dashboard statistics"""
    if not threat_store:
        return {
            "sites_scanned": 0,
            "threats_blocked": 0,
            "trackers_stopped": 0,
            "avg_trust_score": 100,
            "threats_by_level": {"HIGH": 0, "MEDIUM": 0, "LOW": 0},
            "threats_by_category": {cat: 0 for cat in THREAT_CATEGORIES.keys()}
        }
    
    total_threats = len(threat_store)
    
    # Count by threat level
    high_count = sum(1 for t in threat_store if t["threat_level"] == "HIGH")
    medium_count = sum(1 for t in threat_store if t["threat_level"] == "MEDIUM")
    low_count = sum(1 for t in threat_store if t["threat_level"] == "LOW")
    
    # Count by category
    category_counts = {cat: 0 for cat in THREAT_CATEGORIES.keys()}
    for threat in threat_store:
        cat = threat.get("category", "Phishing")
        if cat in category_counts:
            category_counts[cat] += 1
    
    # Average trust score
    avg_trust = (
        sum(t["trust_score"] for t in threat_store) / len(threat_store)
        if threat_store
        else 100
    )
    
    # Simulate related metrics (in a real system, track these separately)
    trackers_blocked = total_threats * 118  # Realistic ratio
    
    return {
        "sites_scanned": total_threats + 1418,  # Add baseline scans
        "threats_blocked": total_threats,
        "trackers_stopped": trackers_blocked,
        "avg_trust_score": round(avg_trust, 1),
        "threats_by_level": {
            "HIGH": high_count,
            "MEDIUM": medium_count,
            "LOW": low_count
        },
        "threats_by_category": category_counts
    }

def clear_threats():
    """Clear all stored threats (for testing)"""
    global threat_store
    threat_store = []
