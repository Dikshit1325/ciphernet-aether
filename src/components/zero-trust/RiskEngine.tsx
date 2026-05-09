import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface RiskEngineProps {
  riskScore: number;
  threatLevel: string;
  deviceTrust: number;
  sessionTrust: number;
  aiConfidence: number;
}

export function RiskEngine({ riskScore, threatLevel, deviceTrust, sessionTrust, aiConfidence }: RiskEngineProps) {
  
  const getThreatColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-destructive";
      case "MEDIUM": return "text-warning";
      case "LOW": return "text-cyber-cyan";
      default: return "text-emerald-500";
    }
  };

  const getThreatBg = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-destructive";
      case "MEDIUM": return "bg-warning";
      case "LOW": return "bg-cyber-cyan";
      default: return "bg-emerald-500";
    }
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden group h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center">
          <Activity className="h-5 w-5 text-cyber-cyan" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">AI Risk Engine</h3>
          <p className="text-sm text-muted-foreground">Real-time telemetry & analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Global Risk Score</span>
            <span className={`text-sm font-bold ${getThreatColor(threatLevel)}`}>{riskScore}/100</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div 
              className={`h-full ${getThreatBg(threatLevel)}`}
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background/40 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Threat Level</div>
            <div className={`text-xl font-display font-bold ${getThreatColor(threatLevel)}`}>{threatLevel}</div>
          </div>
          <div className="p-4 rounded-lg bg-background/40 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">AI Confidence</div>
            <div className="text-xl font-display font-bold text-cyber-cyan">{aiConfidence}%</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Device Trust</span>
              <span className="text-xs font-bold text-cyber-cyan">{deviceTrust}%</span>
            </div>
            <Progress value={deviceTrust} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Session Trust</span>
              <span className="text-xs font-bold text-cyber-cyan">{sessionTrust}%</span>
            </div>
            <Progress value={sessionTrust} className="h-1.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
