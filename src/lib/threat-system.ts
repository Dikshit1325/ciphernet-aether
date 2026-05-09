/**
 * Enterprise threat level color system
 * Maps threat levels to visual styling for consistent cyber aesthetic
 */

export type ThreatLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const getThreatLevel = (score: number): ThreatLevel => {
  if (score < 20) return "SAFE";
  if (score < 40) return "LOW";
  if (score < 60) return "MEDIUM";
  if (score < 80) return "HIGH";
  return "CRITICAL";
};

export const threatColors = {
  SAFE: {
    bg: "bg-cyber-green/5",
    border: "border-cyber-green/30",
    text: "text-cyber-green",
    badge: "bg-cyber-green/15 text-cyber-green border-cyber-green/30",
    accent: "from-cyber-green to-cyan-500",
  },
  LOW: {
    bg: "bg-cyan-500/5",
    border: "border-cyber-cyan/30",
    text: "text-cyber-cyan",
    badge: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30",
    accent: "from-cyber-cyan to-blue-500",
  },
  MEDIUM: {
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/30",
    text: "text-yellow-500",
    badge: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
    accent: "from-yellow-500 to-orange-500",
  },
  HIGH: {
    bg: "bg-orange-500/5",
    border: "border-orange-500/30",
    text: "text-orange-500",
    badge: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    accent: "from-orange-500 to-cyber-red",
  },
  CRITICAL: {
    bg: "bg-cyber-red/5",
    border: "border-cyber-red/30",
    text: "text-cyber-red",
    badge: "bg-cyber-red/15 text-cyber-red border-cyber-red/30",
    accent: "from-cyber-red to-cyber-purple",
    glow: "shadow-lg shadow-cyber-red/50",
  },
};

export const getThreatBadgeClass = (level: ThreatLevel): string => {
  return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${threatColors[level].badge}`;
};

export const getThreatTextColor = (level: ThreatLevel): string => {
  return threatColors[level].text;
};

export const getThreatBgColor = (level: ThreatLevel): string => {
  return threatColors[level].bg;
};

export const getThreatBorderColor = (level: ThreatLevel): string => {
  return threatColors[level].border;
};
