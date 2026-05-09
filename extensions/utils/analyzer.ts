/**
 * URL Analysis Utility for Chrome Extension
 * Implements cybersecurity analysis logic for URLs
 */

export interface AnalysisResult {
  trustScore: number;
  threatLevel: "HIGH" | "MEDIUM" | "LOW" | "SAFE";
  phishingRisk: number;
  manipulationScore: number;
  riskFactors: string[];
  aiExplanation: string;
}

/**
 * Suspicious keywords commonly used in phishing URLs
 */
const PHISHING_KEYWORDS = [
  "login",
  "signin",
  "auth",
  "verify",
  "confirm",
  "update",
  "secure",
  "account",
  "bank",
  "paypal",
  "amazon",
  "apple",
  "google",
  "microsoft",
  "otp",
  "password",
  "reset",
];

/**
 * Suspicious TLDs often used in phishing
 */
const SUSPICIOUS_TLDS = [
  ".tk",
  ".ml",
  ".cf",
  ".ga",
  ".pw",
  ".download",
  ".racing",
  ".stream",
  ".party",
  ".zip",
  ".review",
];

/**
 * Malware keywords
 */
const MALWARE_KEYWORDS = [
  "malware",
  "exploit",
  "trojan",
  "ransomware",
  "backdoor",
  "crack",
  "keygen",
  "warez",
  "pirate",
];

/**
 * Analyze a URL for security threats
 * Returns a comprehensive threat assessment
 */
export function analyzeURL(url: string): AnalysisResult {
  try {
    const urlObj = new URL(url);
    let riskScore = 0;
    const riskFactors: string[] = [];

    // ============================================
    // 1. HTTPS Check (Most Important)
    // ============================================
    if (urlObj.protocol !== "https:") {
      riskScore += 35;
      riskFactors.push(
        "⚠️ Not using HTTPS - Communication is not encrypted"
      );
    } else {
      // Bonus for HTTPS
      riskScore -= 5;
    }

    // ============================================
    // 2. URL Length Analysis
    // ============================================
    if (url.length > 75) {
      riskScore += 15;
      riskFactors.push(
        "🔗 Unusually long URL - May contain hidden parameters"
      );
    }

    // ============================================
    // 3. Suspicious Keywords Analysis
    // ============================================
    const urlLower = url.toLowerCase();
    const foundPhishingKeywords = PHISHING_KEYWORDS.filter((kw) =>
      urlLower.includes(kw)
    );

    if (foundPhishingKeywords.length > 0) {
      riskScore += 20 * foundPhishingKeywords.length;
      riskFactors.push(
        `🎣 Phishing keywords detected: ${foundPhishingKeywords.join(", ")}`
      );
    }

    // ============================================
    // 4. IP-Based URLs (High Risk)
    // ============================================
    const ipPattern =
      /^(\d{1,3}\.){3}\d{1,3}$|::|[\da-fA-F]{0,4}:[\da-fA-F]{0,4}:/;
    if (ipPattern.test(urlObj.hostname)) {
      riskScore += 45;
      riskFactors.push(
        "🔴 IP-based URL detected - Legitimate sites use domain names"
      );
    }

    // ============================================
    // 5. Domain Length Analysis
    // ============================================
    if (urlObj.hostname.length > 40) {
      riskScore += 10;
      riskFactors.push(
        "📝 Excessively long domain - May be attempting confusion"
      );
    }

    // ============================================
    // 6. Subdomain Analysis
    // ============================================
    const subdomainCount = (urlObj.hostname.match(/\./g) || []).length;
    if (subdomainCount > 3) {
      riskScore += 15;
      riskFactors.push(
        "🏗️ Multiple subdomains detected - Suspicious structure"
      );
    }

    // ============================================
    // 7. Hyphen in Domain (Typosquat Risk)
    // ============================================
    if (urlObj.hostname.includes("-")) {
      riskScore += 12;
      riskFactors.push("🔤 Hyphens in domain - Possible typosquatting attempt");
    }

    // ============================================
    // 8. TLD Analysis
    // ============================================
    const tldMatch = urlObj.hostname.match(/\.[a-z]{2,}$/i);
    if (tldMatch) {
      const tld = tldMatch[0].toLowerCase();
      if (SUSPICIOUS_TLDS.includes(tld)) {
        riskScore += 25;
        riskFactors.push(
          `⚡ Suspicious TLD (${tld}) - Often used for malicious sites`
        );
      }
    }

    // ============================================
    // 9. Malware Keywords
    // ============================================
    const foundMalwareKeywords = MALWARE_KEYWORDS.filter((kw) =>
      urlLower.includes(kw)
    );
    if (foundMalwareKeywords.length > 0) {
      riskScore += 40;
      riskFactors.push(
        `⚠️ Potential malware indicators: ${foundMalwareKeywords.join(", ")}`
      );
    }

    // ============================================
    // 10. Redirect Patterns (Common in Phishing)
    // ============================================
    if (
      urlLower.includes("redirect") ||
      urlLower.includes("redir") ||
      urlLower.includes("forward")
    ) {
      riskScore += 20;
      riskFactors.push("🔀 Redirect pattern detected - May hide true destination");
    }

    // ============================================
    // 11. Data Exfiltration Patterns
    // ============================================
    if (
      urlLower.includes("bit.ly") ||
      urlLower.includes("tinyurl") ||
      urlLower.includes("short")
    ) {
      riskScore += 18;
      riskFactors.push("🔗 URL shortener detected - True destination is hidden");
    }

    // ============================================
    // 12. Obfuscation Techniques
    // ============================================
    if (
      urlLower.includes("%") ||
      urlLower.includes("&#") ||
      urlLower.includes("\\x")
    ) {
      riskScore += 22;
      riskFactors.push(
        "🔐 URL obfuscation detected - Attempting to hide true intent"
      );
    }

    // ============================================
    // Normalization
    // ============================================
    riskScore = Math.max(0, Math.min(100, riskScore)); // Clamp between 0-100

    const trustScore = Math.max(0, 100 - riskScore);

    // ============================================
    // Threat Level Classification
    // ============================================
    let threatLevel: "HIGH" | "MEDIUM" | "LOW" | "SAFE";
    if (riskScore >= 70) {
      threatLevel = "HIGH";
    } else if (riskScore >= 40) {
      threatLevel = "MEDIUM";
    } else if (riskScore >= 15) {
      threatLevel = "LOW";
    } else {
      threatLevel = "SAFE";
    }

    // ============================================
    // Generate AI Explanation
    // ============================================
    const aiExplanation = generateAIExplanation(
      threatLevel,
      riskFactors,
      trustScore
    );

    // ============================================
    // Calculate Manipulation Score
    // ============================================
    const manipulationScore = calculateManipulationScore(riskFactors);

    return {
      trustScore,
      threatLevel,
      phishingRisk: riskScore,
      manipulationScore,
      riskFactors: riskFactors.length > 0 ? riskFactors : ["Site appears safe"],
      aiExplanation,
    };
  } catch (error) {
    // Invalid URL
    return {
      trustScore: 0,
      threatLevel: "HIGH",
      phishingRisk: 95,
      manipulationScore: 90,
      riskFactors: ["Invalid or malformed URL"],
      aiExplanation:
        "This URL is malformed or invalid. It cannot be properly analyzed.",
    };
  }
}

/**
 * Generate AI-style explanation for the threat assessment
 */
function generateAIExplanation(
  threatLevel: string,
  riskFactors: string[],
  trustScore: number
): string {
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

/**
 * Calculate manipulation score based on detected risk factors
 * Manipulation refers to psychological/social engineering tactics
 */
function calculateManipulationScore(riskFactors: string[]): number {
  let score = 0;

  const manipulationKeywords = [
    "phishing",
    "keyword",
    "redirect",
    "shortener",
    "obfuscation",
    "hidden",
  ];

  riskFactors.forEach((factor) => {
    if (
      manipulationKeywords.some((kw) =>
        factor.toLowerCase().includes(kw)
      )
    ) {
      score += 20;
    }
  });

  return Math.min(100, score);
}

/**
 * Extract favicon URL from a website
 * Useful for visual identification in the dashboard
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return "";
  }
}

/**
 * Extract hostname from URL
 */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
