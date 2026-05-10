from app.schemas.zero_trust_schema import AccessRequest, AccessResponse
import random

def evaluate_access_request(request: AccessRequest) -> AccessResponse:
    risk_score = 10
    reasons = []
    recommendations = []
    
    # 1. Location and VPN Check
    high_risk_countries = ["Russia", "China", "North Korea", "Iran", "Unknown"]
    if any(country.lower() in request.location.lower() for country in high_risk_countries):
        risk_score += 40
        reasons.append(f"High-risk login location detected: {request.location}")
        recommendations.append("Require immediate re-authentication via MFA")
        
    if not request.vpn_enabled:
        risk_score += 15
        reasons.append("VPN connection absent during access request")
        if "Require VPN for remote access" not in recommendations:
            recommendations.append("Require VPN for remote access")
            
    # 2. Time Check
    # Simplistic check for unusual hours (e.g., 01:00 AM to 05:00 AM)
    if "AM" in request.login_time and any(h in request.login_time for h in ["01:", "02:", "03:", "04:", "05:"]):
        risk_score += 20
        reasons.append(f"Suspicious login timing outside business hours ({request.login_time})")
        
    # 3. Device Check
    if "Unknown" in request.device or "Unrecognized" in request.device:
        risk_score += 25
        reasons.append("Unknown or unverified device fingerprint")
        recommendations.append("Isolate endpoint pending verification")
        device_trust = random.randint(10, 30)
    else:
        device_trust = random.randint(70, 95)
        
    # 4. Privilege Escalation Check
    if request.admin_request and request.role.lower() != "admin":
        risk_score += 50
        reasons.append("Attempted admin privilege escalation by non-admin user")
        recommendations.append("Trigger high-priority SOC alert")
        recommendations.append("Quarantine user session")
        
    # 5. MFA Check
    if request.admin_request and not request.mfa_enabled:
        risk_score += 35
        reasons.append("Admin access requested without MFA enabled")
        if "Force MFA" not in recommendations:
            recommendations.append("Force MFA configuration")
            
    # 6. Telemetry Anomaly Integration
    if request.telemetry_anomaly_score > 0:
        if request.telemetry_anomaly_score >= 70:
            risk_score += 60
            reasons.append(f"Critical browser telemetry anomaly detected (Score: {request.telemetry_anomaly_score})")
            recommendations.append("Isolate network access immediately")
        elif request.telemetry_anomaly_score >= 40:
            risk_score += 30
            reasons.append(f"Elevated browser behavioral anomaly (Score: {request.telemetry_anomaly_score})")
            recommendations.append("Require step-up authentication")
        else:
            risk_score += 10
            reasons.append(f"Minor telemetry deviation observed (Score: {request.telemetry_anomaly_score})")

    # Cap risk score
    risk_score = min(risk_score, 100)
    
    # AI Confidence and Session Trust
    ai_confidence = random.randint(85, 99)
    session_trust = max(0, 100 - risk_score)
    
    # Determine Decision and Threat Level
    if risk_score >= 75:
        decision = "BLOCK"
        threat_level = "HIGH"
    elif risk_score >= 40:
        decision = "REQUIRE MFA"
        threat_level = "MEDIUM"
    elif risk_score >= 20:
        decision = "MONITOR SESSION"
        threat_level = "LOW"
    else:
        decision = "ALLOW"
        threat_level = "SAFE"
        reasons.append("Access appears legitimate and within baseline bounds")
        recommendations.append("Standard monitoring")
        
    return AccessResponse(
        risk_score=risk_score,
        decision=decision,
        threat_level=threat_level,
        device_trust=device_trust,
        session_trust=session_trust,
        ai_confidence=ai_confidence,
        reasons=reasons,
        recommendations=list(set(recommendations))
    )
