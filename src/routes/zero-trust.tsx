import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Shield, Fingerprint, MapPin, KeyRound, ServerCrash } from "lucide-react";
import { AccessSimulator, AccessRequestData } from "@/components/zero-trust/AccessSimulator";
import { RiskEngine } from "@/components/zero-trust/RiskEngine";
import { DecisionPanel } from "@/components/zero-trust/DecisionPanel";
import { SecurityLogs, LogEntry } from "@/components/zero-trust/SecurityLogs";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

import { DeviceTrustCard } from "@/components/zero-trust/DeviceTrustCard";

export const Route = createFileRoute("/zero-trust")({
  component: ZeroTrustPage,
});

function PolicyCard({ title, active, icon: Icon }: { title: string; active: boolean; icon: any }) {
  return (
    <div className={`p-4 rounded-lg border transition-all ${active ? "bg-cyber-cyan/10 border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "bg-background/40 border-border/50 opacity-60"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${active ? "text-cyber-cyan" : "text-muted-foreground"}`} />
        <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{title}</span>
      </div>
    </div>
  );
}

export function ZeroTrustPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: new Date().toLocaleTimeString(), action: "Zero Trust Engine initialized and monitoring.", level: "info" }
  ]);

  const addLog = (action: string, level: LogEntry["level"]) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      level
    }]);
  };

  const handleSimulate = useCallback(async (data: AccessRequestData) => {
    setLoading(true);
    setResult(null);
    addLog(`Intercepted access request from ${data.employee} (${data.ip_address})`, "info");
    addLog(`Analyzing context: ${data.device} from ${data.location}`, "info");

    try {
      // Fast API Backend Call
      const res = await fetch("http://localhost:8000/api/zero-trust/simulate-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Backend connection failed");
      const analysis = await res.json();

      setResult(analysis);

      // Add appropriate logs based on decision
      if (analysis.decision === "BLOCK") {
        addLog(`CRITICAL: Access blocked. Risk score ${analysis.risk_score}/100`, "error");
        analysis.reasons.forEach((r: string) => addLog(`Anomaly: ${r}`, "warn"));
      } else if (analysis.decision === "REQUIRE MFA") {
        addLog(`WARNING: Suspicious context. Enforcing MFA challenge.`, "warn");
      } else {
        addLog(`SUCCESS: Context verified. Access granted.`, "success");
      }

      // Log to Firebase
      try {
        await addDoc(collection(db, "zero_trust_logs"), {
          ...data,
          ...analysis,
          timestamp: serverTimestamp()
        });
        addLog("Event telemetry synchronized to Firestore.", "info");
      } catch (fbErr) {
        console.error("Firebase log failed", fbErr);
        addLog("Failed to sync telemetry to Firestore.", "warn");
      }

    } catch (err) {
      toast.error("Simulation failed. Ensure backend is running.");
      addLog("System Error: Failed to evaluate policy.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background selection:bg-cyber-cyan/30">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyber-cyan/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-medium tracking-wide uppercase mb-4">
            <Shield className="h-3.5 w-3.5" />
            Active Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground mb-4">
            Zero Trust Command Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Simulate and evaluate dynamic access policies. The AI Trust Engine analyzes user context, device health, and behavioral anomalies to continuously verify identity before granting access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Simulator Form */}
          <div className="lg:col-span-2">
            <AccessSimulator onSimulate={handleSimulate} loading={loading} />
          </div>
          
          {/* Real-time Logs and Device Trust */}
          <div className="lg:col-span-1 space-y-6">
            <SecurityLogs logs={logs} />
            <DeviceTrustCard score={result?.device_trust || 100} />
          </div>
        </div>

        {/* Analytics & Decision Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <RiskEngine 
              riskScore={result?.risk_score || 0} 
              threatLevel={result?.threat_level || "SAFE"} 
              deviceTrust={result?.device_trust || 100} 
              sessionTrust={result?.session_trust || 100} 
              aiConfidence={result?.ai_confidence || 100} 
            />
          </div>
          <div className="lg:col-span-2">
            <DecisionPanel 
              decision={result?.decision || null} 
              reasons={result?.reasons || []} 
              recommendations={result?.recommendations || []} 
            />
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">Active Zero Trust Policies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PolicyCard title="Continuous Authentication" active={true} icon={Fingerprint} />
            <PolicyCard title="Geographic Fencing" active={true} icon={MapPin} />
            <PolicyCard title="Privileged Access Management" active={true} icon={KeyRound} />
            <PolicyCard title="Device Posture Check" active={true} icon={ServerCrash} />
          </div>
        </div>
      </div>
    </div>
  );
}
