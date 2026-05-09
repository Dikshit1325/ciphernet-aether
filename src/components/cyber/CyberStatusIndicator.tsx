import { motion } from "framer-motion";
import { Activity, Zap, Eye } from "lucide-react";

export type StatusType = "active" | "monitoring" | "threat" | "safe";

interface CyberStatusIndicatorProps {
  status: StatusType;
  label: string;
  pulsing?: boolean;
  className?: string;
}

/**
 * Animated cyber status indicator with pulsing effects
 */
export function CyberStatusIndicator({
  status,
  label,
  pulsing = true,
  className = "",
}: CyberStatusIndicatorProps) {
  const statusConfig = {
    active: {
      color: "text-cyber-cyan",
      bg: "bg-cyber-cyan/10",
      border: "border-cyber-cyan/30",
      dot: "bg-cyber-cyan",
      icon: Zap,
    },
    monitoring: {
      color: "text-cyber-purple",
      bg: "bg-cyber-purple/10",
      border: "border-cyber-purple/30",
      dot: "bg-cyber-purple",
      icon: Eye,
    },
    threat: {
      color: "text-cyber-red",
      bg: "bg-cyber-red/10",
      border: "border-cyber-red/30",
      dot: "bg-cyber-red",
      icon: Activity,
    },
    safe: {
      color: "text-cyber-green",
      bg: "bg-cyber-green/10",
      border: "border-cyber-green/30",
      dot: "bg-cyber-green",
      icon: Activity,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border ${config.bg} ${config.border} ${className}`}
    >
      <motion.div
        animate={pulsing ? { scale: [1, 1.3, 1] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className={`flex-shrink-0 h-2 w-2 rounded-full ${config.dot}`}
      />

      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Group of status indicators for dashboard
 */
export function CyberStatusGroup() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CyberStatusIndicator status="active" label="AI Engine Active" pulsing />
      <CyberStatusIndicator status="monitoring" label="Threat Intelligence Online" pulsing />
      <CyberStatusIndicator status="safe" label="Live Monitoring" pulsing />
    </div>
  );
}

/**
 * Threat indicator with glow effect for alerts
 */
interface ThreatIndicatorProps {
  count: number;
  critical: number;
  className?: string;
}

export function ThreatIndicator({ count, critical, className = "" }: ThreatIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Active Threats
        </div>
        <motion.div
          animate={{ scale: critical > 0 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1.5, repeat: critical > 0 ? Infinity : 0 }}
          className="text-sm font-display font-semibold text-cyber-red"
        >
          {count}
        </motion.div>
      </div>
      {critical > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-[10px] text-cyber-red/80"
        >
          🚨 {critical} critical
        </motion.div>
      )}
    </motion.div>
  );
}
