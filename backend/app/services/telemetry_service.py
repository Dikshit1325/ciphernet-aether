from app.schemas.telemetry_schema import TelemetryRequest, TelemetryResponse
import math
from collections import Counter
from urllib.parse import urlparse

def calculate_shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    counts = Counter(data)
    for count in counts.values():
        p_x = count / length
        entropy += - p_x * math.log2(p_x)
    return float(round(entropy, 2))

def analyze_telemetry(request: TelemetryRequest) -> TelemetryResponse:
    risk_factors = []
    anomaly_score = 0
    phishing_risk = 0
    manipulation_score = 0

    # 1. Domain Entropy Analysis
    entropy = calculate_shannon_entropy(request.hostname)
    # Typical English domains have entropy between 2.5 and 3.5.
    # DGA (Domain Generation Algorithm) or random phishing domains often have > 4.0
    if entropy > 4.0:
        anomaly_score += 35
        phishing_risk += 40
        risk_factors.append(f"High domain entropy ({entropy}) indicates algorithmically generated or deceptive domain structure.")
    elif entropy > 3.5:
        anomaly_score += 15
        risk_factors.append(f"Elevated domain entropy ({entropy}).")

    # 2. Redirect Chains
    if request.redirectDepth > 2:
        anomaly_score += 25
        manipulation_score += 30
        risk_factors.append(f"Suspicious redirect chain depth ({request.redirectDepth} hops). Potential evasion tactic.")
    elif request.redirectDepth > 0:
        anomaly_score += 10
        risk_factors.append("Redirection detected.")

    # 3. Keyword Detection
    if request.suspiciousKeywords:
        anomaly_score += 20 * len(request.suspiciousKeywords)
        phishing_risk += 25 * len(request.suspiciousKeywords)
        manipulation_score += 15 * len(request.suspiciousKeywords)
        risk_factors.append(f"Credential harvesting indicators found: {', '.join(request.suspiciousKeywords)}.")

    # 4. Behavioral Pattern
    if request.browsingPattern.lower() in ["erratic", "rapid_navigation", "hidden_iframe"]:
        anomaly_score += 30
        manipulation_score += 40
        risk_factors.append(f"Anomalous browsing sequence identified: {request.browsingPattern}.")
    
    # URL Length
    if len(request.url) > 100:
        anomaly_score += 15
        risk_factors.append("Excessively long URL often used for payload delivery or tracking evasion.")

    # Cap Scores
    anomaly_score = min(100, anomaly_score)
    phishing_risk = min(100, phishing_risk)
    manipulation_score = min(100, manipulation_score)

    # Calculate Trust Score
    # Inverse of maximum risk vector
    max_risk = max(anomaly_score, phishing_risk, manipulation_score)
    trust_score = max(0, 100 - max_risk)

    # Determine Threat Level
    threat_level = "SAFE"
    if max_risk >= 75:
        threat_level = "HIGH"
    elif max_risk >= 40:
        threat_level = "MEDIUM"
    elif max_risk >= 20:
        threat_level = "LOW"

    if not risk_factors:
        risk_factors.append("Behavioral baseline normal. No immediate threats detected.")

    # Generate Enterprise AI Reasoning
    ai_reasoning = ""
    if threat_level == "HIGH":
        ai_reasoning = f"CRITICAL ANOMALY: Session deviates severely from trusted baseline. Top concern: {risk_factors[0]} Recommend immediate termination of connection."
    elif threat_level == "MEDIUM":
        ai_reasoning = f"ELEVATED RISK: Suspicious telemetry detected. {risk_factors[0]} Proceed with heightened monitoring."
    elif threat_level == "LOW":
        ai_reasoning = f"MINOR DEVIATION: Non-standard behavior detected but within acceptable tolerances. {risk_factors[0]}"
    else:
        ai_reasoning = "VERIFIED: Domain entropy and behavioral telemetry match established safe baselines."

    return TelemetryResponse(
        trustScore=trust_score,
        phishingRisk=phishing_risk,
        manipulationScore=manipulation_score,
        anomalyScore=anomaly_score,
        threatLevel=threat_level,
        riskFactors=risk_factors,
        aiReasoning=ai_reasoning,
        domainEntropy=entropy,
        redirectDepth=request.redirectDepth,
        suspiciousKeywords=request.suspiciousKeywords,
        browsingPattern=request.browsingPattern
    )
