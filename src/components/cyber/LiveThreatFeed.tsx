import { motion } from "framer-motion";
import { AlertTriangle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export interface ThreatFeedItem {
  id: string;
  type: "phishing" | "credential" | "redirect" | "fraud" | "malware";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
}

const threatFeedData: ThreatFeedItem[] = [
  {
    id: "1",
    type: "phishing",
    title: "Phishing campaign blocked",
    description: "RU ASN 62001 - banking credential harvesting",
    severity: "critical",
  },
  {
    id: "2",
    type: "credential",
    title: "Suspicious QR redirect",
    description: "Intercepted obfuscated redirect to malware C2",
    severity: "critical",
  },
  {
    id: "3",
    type: "fraud",
    title: "Credential harvesting domain",
    description: "Fresh fake bank login portal detected",
    severity: "high",
  },
  {
    id: "4",
    type: "redirect",
    title: "Fake banking login",
    description: "Spoofed Axiom Bank portal - phishing kit identified",
    severity: "critical",
  },
  {
    id: "5",
    type: "fraud",
    title: "Malicious OTP scam",
    description: "SMS-based OTP interception pattern detected",
    severity: "high",
  },
  {
    id: "6",
    type: "phishing",
    title: "Employment fraud ring",
    description: "Coordinated fake recruiter network - 47 profiles",
    severity: "high",
  },
];

interface LiveThreatFeedProps {
  className?: string;
}

/**
 * Live cyber threat feed with auto-rotating alerts
 * SOC dashboard style ticker showing detected threats
 */
export function LiveThreatFeed({ className = "" }: LiveThreatFeedProps) {
  const [displayedThreats, setDisplayedThreats] = useState<ThreatFeedItem[]>(
    threatFeedData.slice(0, 3)
  );
  const [currentIndex, setCurrentIndex] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % threatFeedData.length;
        setDisplayedThreats((current) => [
          ...current.slice(1),
          threatFeedData[nextIndex],
        ]);
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const severityColors = {
    critical: "border-cyber-red/40 bg-cyber-red/5",
    high: "border-orange-500/40 bg-orange-500/5",
    medium: "border-yellow-500/40 bg-yellow-500/5",
  };

  const severityIcons = {
    critical: "text-cyber-red",
    high: "text-orange-500",
    medium: "text-yellow-500",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
        <Zap className="h-3 w-3 text-cyber-cyan" />
        Live Threat Intelligence Feed
      </div>

      <div className="space-y-2 max-h-64 overflow-hidden">
        {displayedThreats.map((threat, index) => (
          <motion.div
            key={threat.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`rounded-lg border px-3 py-2.5 text-xs transition-all hover:shadow-lg hover:shadow-cyber-cyan/20 cursor-default ${severityColors[threat.severity]}`}
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${severityIcons[threat.severity]}`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground/90 truncate">
                  {threat.title}
                </div>
                <div className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                  {threat.description}
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`flex-shrink-0 h-1.5 w-1.5 rounded-full ${
                  threat.severity === "critical"
                    ? "bg-cyber-red"
                    : threat.severity === "high"
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
