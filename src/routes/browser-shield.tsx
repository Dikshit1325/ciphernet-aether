import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { motion } from "framer-motion";
import {
  Chrome,
  Shield,
  AlertOctagon,
  CheckCircle2,
  X,
  Flag,
  Loader2,
  Activity,
  Globe,
  TrendingDown,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  useBrowserScans,
  useDashboardStats,
  useRecentThreats,
  useRecentTrustedSites,
} from "@/hooks/use-firestore-scans";
import { Timestamp } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const Route = createFileRoute("/browser-shield")({
  head: () => ({
    meta: [
      { title: "Browser Telemetry — CipherNet AI" },
    ],
  }),
  component: Page,
});

function formatDomain(url: string, maxLength: number = 35): string {
  try {
    const domain = new URL(url.startsWith("http") ? url : "https://" + url).hostname;
    const clean = domain.startsWith("www.") ? domain.slice(4) : domain;
    return clean.length > maxLength ? clean.slice(0, maxLength) + "..." : clean;
  } catch {
    return url;
  }
}

function getRelativeTime(timestamp: Timestamp | Date | string | null): string {
  if (!timestamp) return "just now";
  try {
    const date =
      timestamp instanceof Timestamp
        ? timestamp.toDate()
        : typeof timestamp === "string"
        ? new Date(timestamp)
        : timestamp;

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  } catch {
    return "recently";
  }
}

function getThreatColor(level: string): string {
  switch (level) {
    case "HIGH": return "text-cyber-red";
    case "MEDIUM": return "text-cyber-purple";
    case "LOW": return "text-cyber-green";
    case "SAFE": return "text-cyber-cyan";
    default: return "text-muted-foreground";
  }
}

function Page() {
  const { scans: allScans, loading: scansLoading } = useBrowserScans(50);
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  
  const loading = scansLoading || statsLoading;
  const latestScan = allScans?.[0] || null;

  // Chart data formatting
  const chartData = [...(allScans || [])].reverse().slice(-15).map(scan => ({
    time: getRelativeTime(scan.scannedAt),
    trustScore: scan.trustScore,
    anomalyScore: scan.anomalyScore || 0,
    domain: formatDomain(scan.url, 15)
  }));

  const highRiskScans = allScans?.filter(s => s.threatLevel === "HIGH" || (s.anomalyScore && s.anomalyScore > 70)) || [];

  return (
    <PageShell
      eyebrow="Telemetry Engine"
      title={
        <>
          Browser <span className="text-gradient-cyber">Telemetry</span> Center
        </>
      }
      subtitle="SOC-style live monitoring of behavioral anomalies, domain entropy, and adaptive trust scoring."
    >
      <div className="grid lg:grid-cols-4 gap-4 mb-4">
        <Stat
          label="Total Events Logged"
          value={stats?.totalScans.toLocaleString() || "0"}
          accent="cyan"
          icon={<Activity className="h-4 w-4" />}
        />
        <Stat
          label="High Risk Anomalies"
          value={stats?.highThreats.toLocaleString() || "0"}
          accent="red"
          icon={<AlertOctagon className="h-4 w-4" />}
        />
        <Stat
          label="Avg Trust Score"
          value={stats?.averageTrustScore.toString() || "—"}
          accent="green"
          icon={<Shield className="h-4 w-4" />}
        />
        <Stat
          label="Active Sessions"
          value={(stats ? Math.max(1, Math.floor(stats.totalScans / 10)) : 0).toString()}
          accent="purple"
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* LIVE TELEMETRY FEED */}
        <Panel
          className="lg:col-span-2"
          title="Live Telemetry Feed"
          action={
            <span className="text-[10px] text-cyber-cyan flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-cyber-cyan"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              STREAMING
            </span>
          }
        >
          {loading && !allScans?.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-cyber-cyan animate-spin" />
            </div>
          ) : allScans && allScans.length > 0 ? (
            <div className="space-y-2 h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {allScans.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  className="flex items-center gap-3 rounded-md border border-border/40 bg-background/30 px-3 py-2 text-xs"
                >
                  <div className={`h-8 w-8 rounded-md grid place-items-center ${
                    scan.threatLevel === "HIGH" ? "bg-cyber-red/10 border border-cyber-red/30" : "bg-cyber-cyan/10 border border-cyber-cyan/30"
                  }`}>
                    <Activity className={`h-4 w-4 ${scan.threatLevel === "HIGH" ? "text-cyber-red" : "text-cyber-cyan"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-foreground truncate">
                      {formatDomain(scan.url)}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex gap-2">
                      <span>Entropy: {scan.domainEntropy || 'N/A'}</span>
                      <span>|</span>
                      <span>Anomaly: {scan.anomalyScore || 0}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getThreatColor(scan.threatLevel)}`}>
                      {scan.threatLevel}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {getRelativeTime(scan.scannedAt)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground">No telemetry data.</div>
          )}
        </Panel>

        {/* ANOMALY DETECTION PANEL */}
        <Panel title="Latest Anomaly Profile">
          {latestScan ? (
            <div className="space-y-4">
              <div className="relative h-32 w-32 mx-auto">
                <svg viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 255)" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="50" cy="50" r="42"
                    stroke={latestScan.anomalyScore && latestScan.anomalyScore > 50 ? "oklch(0.68 0.24 22)" : "oklch(0.75 0.18 190)"}
                    strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray="263.9"
                    initial={{ strokeDashoffset: 263.9 }}
                    animate={{ strokeDashoffset: 263.9 * (1 - (latestScan.anomalyScore || 0) / 100) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className={`font-display text-2xl font-bold ${(latestScan.anomalyScore || 0) > 50 ? 'text-cyber-red' : 'text-cyber-cyan'}`}>
                      {latestScan.anomalyScore || 0}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Anomaly</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Target Domain</span>
                  <span className="font-mono truncate max-w-[120px]">{formatDomain(latestScan.url)}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Domain Entropy</span>
                  <span className="text-cyber-cyan">{latestScan.domainEntropy || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Behavioral Deviation</span>
                  <span className="text-cyber-purple">{latestScan.riskFactors?.[0] || 'Baseline'}</span>
                </div>
              </div>
              
              <div className="mt-2 p-2 rounded bg-background/50 border border-border/50 text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-cyber-cyan">AI Reasoning:</span> {latestScan.aiExplanation}
              </div>
            </div>
          ) : (
             <div className="text-center py-8 text-xs text-muted-foreground">Waiting for telemetry...</div>
          )}
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* TRUST SCORE ANALYTICS */}
        <Panel title="Trust vs Anomaly Trends">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.18 190)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.75 0.18 190)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.68 0.24 22)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.68 0.24 22)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickMargin={10} />
                <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="trustScore" name="Trust Score" stroke="oklch(0.75 0.18 190)" fillOpacity={1} fill="url(#colorTrust)" />
                <Area type="monotone" dataKey="anomalyScore" name="Anomaly Score" stroke="oklch(0.68 0.24 22)" fillOpacity={1} fill="url(#colorAnomaly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* LIVE ALERT STREAM */}
        <Panel 
          title="High-Risk Alert Stream" 
          action={<div className="h-2 w-2 rounded-full bg-cyber-red animate-pulse" />}
        >
          {highRiskScans.length > 0 ? (
            <div className="space-y-3 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {highRiskScans.map((alert) => (
                <div key={alert.id} className="p-3 rounded-md border border-cyber-red/30 bg-cyber-red/5 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-red shadow-[0_0_10px_oklch(0.68_0.24_22)]" />
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold text-cyber-red uppercase tracking-wide">
                        CRITICAL ANOMALY DETECTED
                      </div>
                      <div className="text-sm font-mono text-foreground mt-1 truncate max-w-[200px]">
                        {formatDomain(alert.url)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{getRelativeTime(alert.scannedAt)}</div>
                      <div className="text-[10px] font-bold mt-1 text-cyber-red bg-cyber-red/10 px-2 py-0.5 rounded">
                        Score: {alert.anomalyScore}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    {alert.aiExplanation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
              <Shield className="h-8 w-8 mb-2 opacity-50 text-cyber-green" />
              <div className="text-xs">No high-risk anomalies detected.</div>
            </div>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}


