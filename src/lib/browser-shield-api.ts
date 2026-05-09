/**
 * Browser Shield API Service
 * Handles all communication with the FastAPI backend
 * Provides typed responses using TypeScript interfaces
 */

// TypeScript Interfaces for Type Safety

export interface ThreatData {
  id: string;
  url: string;
  trust_score: number;
  threat_level: "HIGH" | "MEDIUM" | "LOW";
  timestamp: string;
  category: string;
  phishing_probability: number;
  risk_factors: string[];
  ai_explanation?: string;
}

export interface ThreatsResponse {
  threats: ThreatData[];
  total_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export interface StatsData {
  sites_scanned: number;
  threats_blocked: number;
  trackers_stopped: number;
  avg_trust_score: number;
  threats_by_level: {
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  threats_by_category: Record<string, number>;
}

export interface AnalyzeResponse {
  url: string;
  trust_score: number;
  threat_level: string;
  phishing_probability: number;
  risk_factors: string[];
  ai_explanation: string;
  category: string;
  threat_id: string;
}

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================
// Threat & Stats Fetching
// ============================================

/**
 * Fetch recent detected threats from backend
 * @param limit - Number of threats to fetch (default 20)
 * @returns Promise with threats and stats
 */
export async function fetchThreats(limit: number = 20): Promise<ThreatsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/threats?limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch threats:", error);
    throw error;
  }
}

/**
 * Fetch dashboard statistics
 * @returns Promise with stats data
 */
export async function fetchStats(): Promise<StatsData> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
}

/**
 * Analyze a URL for threats
 * @param url - URL to analyze
 * @returns Promise with analysis result
 */
export async function analyzeURL(url: string): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to analyze URL:", error);
    throw error;
  }
}

/**
 * Check backend health status
 * @returns Promise with health status
 */
export async function checkHealth(): Promise<{
  status: string;
  threats_stored: number;
  timestamp: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Backend health check failed:", error);
    throw error;
  }
}

// ============================================
// Data Processing & Formatting
// ============================================

/**
 * Format threat level with color styling
 */
export function getThreatLevelColor(level: "HIGH" | "MEDIUM" | "LOW"): string {
  switch (level) {
    case "HIGH":
      return "text-cyber-red";
    case "MEDIUM":
      return "text-cyber-purple";
    case "LOW":
      return "text-cyber-green";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get category icon emoji/label
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    Phishing: "🎣 Phishing",
    Malware: "⚠️ Malware",
    Scam: "💰 Scam",
    Typosquat: "🔤 Typosquat",
    "Crypto Phish": "🔐 Crypto Phish",
  };
  return labels[category] || category;
}

/**
 * Convert ISO timestamp to relative time (e.g., "2 minutes ago")
 */
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Extract domain from full URL
 */
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url.startsWith("http") ? url : "https://" + url).hostname;
    return domain.startsWith("www.") ? domain.slice(4) : domain;
  } catch {
    return url;
  }
}

/**
 * Format domain name for display (truncate if too long)
 */
export function formatDomainDisplay(url: string, maxLength: number = 35): string {
  const domain = extractDomain(url);
  return domain.length > maxLength ? domain.slice(0, maxLength) + "..." : domain;
}
