import { Laptop, Fingerprint, Activity, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DeviceTrustCard({ score }: { score: number }) {
  return (
    <div className="glass-panel p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Laptop className="h-5 w-5 text-cyber-cyan" />
        <h3 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">Device Trust Analyzer</h3>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative h-24 w-24">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" stroke="currentColor" strokeWidth="8" 
              strokeDasharray="283" 
              strokeDashoffset={283 - (283 * score) / 100} 
              className="text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] transition-all duration-1000" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold font-display text-foreground">{score}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Fingerprint className="h-3 w-3" /> Browser Integrity</span>
            <span className="text-foreground">Verified</span>
          </div>
          <Progress value={100} className="h-1 bg-secondary [&>div]:bg-emerald-500" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> OS Security</span>
            <span className="text-foreground">{score > 50 ? "Healthy" : "Vulnerable"}</span>
          </div>
          <Progress value={score > 50 ? 95 : 30} className={`h-1 bg-secondary [&>div]:${score > 50 ? 'bg-emerald-500' : 'bg-destructive'}`} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> Behavioral Confidence</span>
            <span className="text-foreground">{score}%</span>
          </div>
          <Progress value={score} className={`h-1 bg-secondary [&>div]:${score > 70 ? 'bg-cyber-cyan' : 'bg-warning'}`} />
        </div>
      </div>
    </div>
  );
}
