import { Shield, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DecisionPanelProps {
  decision: string | null;
  reasons: string[];
  recommendations: string[];
}

export function DecisionPanel({ decision, reasons, recommendations }: DecisionPanelProps) {
  
  const getConfig = () => {
    switch (decision) {
      case "ALLOW":
        return {
          icon: <ShieldCheck className="h-12 w-12 text-emerald-500" />,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
        };
      case "BLOCK":
        return {
          icon: <ShieldAlert className="h-12 w-12 text-destructive" />,
          color: "text-destructive",
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
        };
      case "REQUIRE MFA":
        return {
          icon: <UserCheck className="h-12 w-12 text-warning" />,
          color: "text-warning",
          bg: "bg-warning/10",
          border: "border-warning/30",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
        };
      case "MONITOR SESSION":
        return {
          icon: <Shield className="h-12 w-12 text-cyber-cyan" />,
          color: "text-cyber-cyan",
          bg: "bg-cyber-cyan/10",
          border: "border-cyber-cyan/30",
          glow: "shadow-[0_0_30px_rgba(0,240,255,0.3)]",
        };
      default:
        return {
          icon: <Shield className="h-12 w-12 text-muted-foreground" />,
          color: "text-muted-foreground",
          bg: "bg-secondary/30",
          border: "border-border/50",
          glow: "",
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`glass-panel p-6 border transition-all duration-500 ${config.border} ${config.glow} h-full flex flex-col`}>
      <h3 className="font-display font-semibold text-lg text-foreground mb-6">AI Decision Output</h3>
      
      {!decision ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
          <Shield className="h-16 w-16 mb-4 text-muted-foreground animate-pulse" />
          <p className="text-sm">Awaiting simulation data...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={decision}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-center mb-8">
              <div className={`h-24 w-24 rounded-full flex items-center justify-center ${config.bg} border ${config.border}`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {config.icon}
                </motion.div>
              </div>
            </div>

            <div className={`text-center font-display font-black text-3xl tracking-widest mb-8 ${config.color}`}>
              {decision}
            </div>

            <div className="space-y-6 flex-1">
              {reasons.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">AI Reasoning</h4>
                  <ul className="space-y-2">
                    {reasons.map((reason, i) => (
                      <li key={i} className="text-sm flex items-start gap-2 text-foreground/80">
                        <span className="text-cyber-cyan mt-0.5">▸</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Recommendations</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.map((rec, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/50 border border-border/50">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
