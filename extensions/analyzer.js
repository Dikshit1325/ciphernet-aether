/**
 * Analyzer Script for Chrome Extension Popup
 * Exported version of analyzer.ts functions
 * This is a JavaScript version that works in the extension context
 */

// URL Analysis function (Async calling FastAPI Telemetry Endpoint)
export async function analyzeURL(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Simulate detecting suspicious keywords from URL
    const PHISHING_KEYWORDS = [
      "login", "signin", "auth", "verify", "confirm", "update", "secure",
      "account", "bank", "paypal", "amazon", "apple", "google", "microsoft",
      "otp", "password", "reset",
    ];
    const suspiciousKeywords = PHISHING_KEYWORDS.filter(kw => url.toLowerCase().includes(kw));

    // Simulated behavioral pattern (can be passed dynamically later)
    const patterns = ["normal", "erratic", "rapid_navigation"];
    const browsingPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const redirectDepth = Math.floor(Math.random() * 4); // Simulate 0-3 hops

    const payload = {
      url: url,
      hostname: hostname,
      browserTitle: document.title || "Scanned Page",
      redirectDepth: redirectDepth,
      suspiciousKeywords: suspiciousKeywords,
      browsingPattern: browsingPattern
    };

    console.log("Sending telemetry to AI engine:", payload);

    const response = await fetch("http://localhost:8000/api/telemetry/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AI Engine error: ${response.status}`);
    }

    const aiAnalysis = await response.json();
    return aiAnalysis;

  } catch (error) {
    console.error("AI Analysis failed, falling back to static rules:", error);
    return {
      trustScore: 0,
      threatLevel: "HIGH",
      phishingRisk: 95,
      manipulationScore: 90,
      anomalyScore: 90,
      riskFactors: ["Invalid or malformed URL", "AI Engine Unreachable"],
      aiReasoning: "This URL is malformed or the AI engine could not be reached.",
      domainEntropy: 0,
      redirectDepth: 0,
      suspiciousKeywords: [],
      browsingPattern: "unknown"
    };
  }
}

// Generate AI explanation
function generateAIExplanation(threatLevel, riskFactors, trustScore) {
  const topFactor = riskFactors[0] || "General security concerns";

  if (threatLevel === "HIGH") {
    return `🚨 CRITICAL THREAT: This site shows multiple red flags. Primary concern: ${topFactor}. Recommend NOT visiting this URL as it exhibits characteristics commonly associated with phishing or malware distribution.`;
  } else if (threatLevel === "MEDIUM") {
    return `⚠️ CAUTION ADVISED: Several suspicious indicators detected. Primary concern: ${topFactor}. Exercise caution when interacting with this site. Avoid entering sensitive credentials.`;
  } else if (threatLevel === "LOW") {
    return `✓ Minor Risk: This site has some minor security concerns (${topFactor}), but generally appears legitimate. Standard security practices recommended.`;
  } else {
    return `✅ SAFE: This site appears legitimate with a trust score of ${trustScore}. Standard security practices apply. No immediate threats detected.`;
  }
}

// Calculate manipulation score
function calculateManipulationScore(riskFactors) {
  let score = 0;
  const manipulationKeywords = [
    "phishing", "keyword", "redirect", "shortener", "obfuscation", "hidden",
  ];

  riskFactors.forEach((factor) => {
    if (
      manipulationKeywords.some((kw) => factor.toLowerCase().includes(kw))
    ) {
      score += 20;
    }
  });

  return Math.min(100, score);
}

// Get favicon URL
export function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return "";
  }
}

// Get hostname
export function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
