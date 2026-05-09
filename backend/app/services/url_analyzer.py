from urllib.parse import urlparse

suspicious_keywords = [
    "login",
    "verify",
    "bank",
    "secure",
    "update",
    "otp"
]

def analyze_url(url: str):

    risk_score = 0
    risk_factors = []

    parsed = urlparse(url)

    # HTTPS Check
    if parsed.scheme != "https":
        risk_score += 20
        risk_factors.append("Website is not using HTTPS")

    # URL Length Check
    if len(url) > 30:
        risk_score += 10
        risk_factors.append("URL is unusually long")

    # Suspicious Keyword Check
    for keyword in suspicious_keywords:
        if keyword in url.lower():
            risk_score += 15
            risk_factors.append(f"Suspicious keyword detected: {keyword}")

    # Hyphen Check
    if "-" in parsed.netloc:
        risk_score += 10
        risk_factors.append("Too many hyphens in domain")

    # Trust Score
    trust_score = max(0, 100 - risk_score)

    # Threat Level
    if risk_score >= 60:
        threat_level = "HIGH"
    elif risk_score >= 30:
        threat_level = "MEDIUM"
    else:
        threat_level = "LOW"

    # AI Explanation
    explanation = (
        "This URL appears suspicious because it contains phishing-like patterns "
        "commonly used in fake banking and credential theft attacks."
    )

    return {
        "url": url,
        "trust_score": trust_score,
        "phishing_probability": risk_score,
        "threat_level": threat_level,
        "risk_factors": risk_factors,
        "ai_explanation": explanation
    }