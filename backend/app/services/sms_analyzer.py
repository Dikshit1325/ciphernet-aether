import re

# Suspicious scam keywords
scam_keywords = [
    "urgent",
    "verify",
    "bank",
    "blocked",
    "suspended",
    "otp",
    "kyc",
    "click",
    "win",
    "prize",
    "reward",
    "update",
    "password",
    "account",
    "login"
]

# Scam pattern categories
urgency_words = [
    "urgent",
    "immediately",
    "now",
    "within 24 hours",
    "blocked"
]

authority_words = [
    "bank",
    "rbi",
    "government",
    "income tax",
    "support team"
]

credential_words = [
    "otp",
    "password",
    "login",
    "verify",
    "kyc"
]


def analyze_sms(message: str):

    text = message.lower()

    risk_score = 0

    detected_patterns = []
    highlighted_words = []

    # Detect URLs
    urls = re.findall(r'(https?://\S+)', message)

    if urls:
        risk_score += 25
        detected_patterns.append("Suspicious URL detected")

    # Detect scam keywords
    for keyword in scam_keywords:
        if keyword in text:
            risk_score += 5
            highlighted_words.append(keyword)

    # Urgency manipulation detection
    urgency_score = 0
    for word in urgency_words:
        if word in text:
            urgency_score += 20

    if urgency_score > 0:
        detected_patterns.append("Urgency manipulation detected")
        risk_score += urgency_score

    # Authority impersonation detection
    authority_score = 0
    for word in authority_words:
        if word in text:
            authority_score += 15

    if authority_score > 0:
        detected_patterns.append("Authority impersonation detected")
        risk_score += authority_score

    # Credential theft detection
    credential_score = 0
    for word in credential_words:
        if word in text:
            credential_score += 15

    if credential_score > 0:
        detected_patterns.append("Credential theft attempt detected")
        risk_score += credential_score

    # Limit score
    if risk_score > 100:
        risk_score = 100

    # Threat level
    if risk_score >= 75:
        threat_level = "CRITICAL"
    elif risk_score >= 50:
        threat_level = "HIGH"
    elif risk_score >= 25:
        threat_level = "MEDIUM"
    else:
        threat_level = "LOW"

    # AI Explanation
    explanation = (
        "This message appears suspicious because it uses "
        "manipulation tactics commonly found in phishing and scam attacks."
    )

    return {
        "message": message,
        "scam_probability": risk_score,
        "threat_level": threat_level,
        "urgency_score": urgency_score,
        "authority_score": authority_score,
        "credential_theft_score": credential_score,
        "detected_patterns": detected_patterns,
        "highlighted_words": list(set(highlighted_words)),
        "ai_explanation": explanation
    }