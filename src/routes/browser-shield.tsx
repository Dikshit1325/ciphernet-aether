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
} from "lucide-react";
import {
  useBrowserScans,
  useDashboardStats,
  useRecentThreats,
  useRecentTrustedSites,
} from "@/hooks/use-firestore-scans";
import { BrowserScan } from "@/lib/firestore-types";
import { Timestamp } from "firebase/firestore";

export const Route = createFileRoute("/browser-shield")({
  head: () => ({
    meta: [
      { title: "Browser Shield Dashboard — CipherNet AI" },
      {
        name: "description",
        content:
          "Real-time browser protection: live phishing alerts, trust scores and AI-powered website blocking.",
      },
      { property: "og:title", content: "Browser Shield Dashboard — CipherNet AI" },
      {
        property: "og:description",
        content: "Live browser protection with AI-powered website blocking.",
      },
    ],
  }),
  component: Page,
});

/**
 * Utility functions for formatting and display
 */
function formatDomain(url: string, maxLength: number = 35): string {
  try {
    const domain = new URL(url.startsWith("http") ? url : "https://" + url).hostname;
    const clean = domain.startsWith("www.") ? domain.slice(4) : domain;
    return clean.length > maxLength ? clean.slice(0, maxLength) + "..." : clean;
  } catch {
    return url;
  }
}

function getRelativeTime(timestamp: Timestamp | Date | string): string {
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
    case "HIGH":
      return "text-cyber-red";
    case "MEDIUM":
      return "text-cyber-purple";
    case "LOW":
      return "text-cyber-green";
    case "SAFE":
      return "text-cyber-green";
    default:
      return "text-muted-foreground";
  }
}

function Page() {
  // Real-time hooks from Firestore
  const { scans: allScans, loading: scansLoading } = useBrowserScans(100);
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const recentThreats = useRecentThreats(5);
  const trustedSites = useRecentTrustedSites(5);

  // Get latest scan for extension popup mock
  const latestScan = allScans?.[0] || null;

  const loading = scansLoading || statsLoading;

  return (
    <PageShell
      eyebrow="Browser Defense"
      title={
        <>
          Browser <span className="text-gradient-cyber">Shield</span> Dashboard
        </>
      }
      subtitle="Your in-browser AI co-pilot — blocking phishing pages before they load, scoring every site you visit, and explaining why."
    >
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Extension Popup Mock - Shows latest threat */}
        <Panel className="lg:col-span-2" title="Extension Popup">
          <div className="mx-auto max-w-[320px] rounded-2xl glass-strong glow-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple grid place-items-center">
                  <Shield className="h-4 w-4 text-background" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold">CipherNet Shield</div>
                  <div className="text-[10px] text-cyber-green">Active · v4.0</div>
                </div>
              </div>
              <Chrome className="h-4 w-4 text-muted-foreground" />
            </div>

            {loading && !latestScan ? (
              <div className="mt-4 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 p-4 text-center">
                <Loader2 className="h-5 w-5 mx-auto text-cyber-cyan animate-spin" />
                <div className="mt-2 text-xs text-cyber-cyan">Waiting for scan...</div>
              </div>
            ) : latestScan ? (
              <>
                <div
                  className={`mt-4 rounded-lg border  p-3 ${
                    latestScan.threatLevel === "HIGH"
                      ? "border-cyber-red/40 bg-cyber-red/10"
                      : "border-cyber-green/40 bg-cyber-green/10"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between text-[10px] uppercase tracking-widest ${
                      latestScan.threatLevel === "HIGH"
                        ? "text-cyber-red"
                        : "text-cyber-green"
                    }`}
                  >
                    <span>
                      {latestScan.threatLevel === "HIGH"
                        ? "Threat Detected"
                        : "Site Safe"}
                    </span>
                    <span>{getRelativeTime(latestScan.scannedAt)}</span>
                  </div>
                  <div className="mt-2 text-xs font-mono break-all truncate">
                    {formatDomain(latestScan.url, 32)}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 items-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg viewBox="0 0 100 100" className="-rotate-90">
                      <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 255)" strokeWidth="6" fill="none" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="oklch(0.68 0.24 22)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="263.9"
                        initial={{ strokeDashoffset: 263.9 }}
                        animate={{
                          strokeDashoffset:
                            263.9 * (1 - latestScan.trustScore / 100),
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <div className="font-display text-xl font-semibold text-cyber-red">
                          {latestScan.trustScore}
                        </div>
                        <div className="text-[8px] uppercase tracking-widest text-muted-foreground">
                          trust
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phishing Risk</span>
                      <span className="text-cyber-red">
                        {latestScan.phishingRisk}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Threat</span>
                      <span className="text-cyber-red font-semibold">
                        {latestScan.threatLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manipulation</span>
                      <span className="text-cyber-red">
                        {latestScan.manipulationScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                  {latestScan.aiExplanation}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button className="px-2 py-2 rounded-md bg-cyber-red text-background text-[11px] font-semibold flex items-center justify-center gap-1">
                    <X className="h-3 w-3" /> Block
                  </button>
                  <button className="px-2 py-2 rounded-md border border-border/60 text-[11px] flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Continue
                  </button>
                  <button className="px-2 py-2 rounded-md border border-border/60 text-[11px] flex items-center justify-center gap-1">
                    <Flag className="h-3 w-3" /> Report
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-lg border border-cyber-green/40 bg-cyber-green/10 p-4 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto text-cyber-green" />
                <div className="mt-2 text-xs text-cyber-green font-semibold">
                  No Scans Yet
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Scanned sites will appear here
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* Real-Time Threat Feed */}
        <Panel
          className="lg:col-span-3"
          title="Real-Time Threat Blocking"
          action={
            <span className="text-[10px] text-cyber-green flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-cyber-green"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              LIVE
            </span>
          }
        >
          {loading && !allScans?.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-cyber-cyan animate-spin" />
            </div>
          ) : statsError ? (
            <div className="rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-4 text-sm text-cyber-red">
              {statsError}
            </div>
          ) : allScans && allScans.length > 0 ? (
            <div className="space-y-2">
              {allScans.slice(0, 5).map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-md border border-border/50 bg-background/30 px-3 py-2.5"
                >
                  <div className="h-8 w-8 rounded-md bg-cyber-red/10 border border-cyber-red/30 grid place-items-center">
                    <AlertOctagon className="h-4 w-4 text-cyber-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono truncate">
                      {formatDomain(scan.url)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {scan.threatLevel}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {getRelativeTime(scan.scannedAt)}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-widest border rounded-full px-2 py-0.5 whitespace-nowrap ${getThreatColor(
                      scan.threatLevel
                    )}`}
                  >
                    {scan.trustScore}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-xs text-muted-foreground">
                No scans yet. Use the extension to analyze websites.
              </div>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* Browser Trust Monitor */}
        <Panel title="Browser Trust Monitor">
          {trustedSites && trustedSites.length > 0 ? (
            <div className="space-y-3">
              {trustedSites.map((site) => (
                <div key={site.id} className="flex items-center justify-between">
                  <span className="text-xs font-mono truncate">{site.hostname}</span>
                  <span className="text-xs font-semibold text-cyber-green">
                    {site.trustScore}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-4">
              Trusted sites appear here
            </div>
          )}
        </Panel>

        {/* Active Protection Status */}
        <Panel title="Active Protection">
          <ul className="space-y-2 text-xs">
            {[
              "Real-time URL scanning",
              "Phishing kit fingerprinting",
              "Crypto wallet drainer block",
              "Ad-tracker filter",
              "Malicious script sandbox",
              "AI page intent analysis",
            ].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-cyber-green" /> {p}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Today's Activity - Dynamic from Firestore */}
        <Panel title="Today's Activity">
          {stats ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Sites scanned", stats.totalScans.toLocaleString()],
                ["Threats found", stats.threatsDetected.toLocaleString()],
                ["Safe sites", stats.safeSites.toLocaleString()],
                ["Avg trust", Math.round(stats.averageTrustScore)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md border border-border/50 p-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </div>
                  <div className="mt-1 font-display text-xl text-cyber-cyan">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="h-5 w-5 mx-auto text-cyber-cyan animate-spin" />
            </div>
          )}
        </Panel>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Active Installs"
          value={stats?.totalScans.toLocaleString() || "0"}
          accent="cyan"
        />
        <Stat
          label="High Threats"
          value={stats?.highThreats.toLocaleString() || "0"}
          accent="red"
        />
        <Stat
          label="Safe Sites"
          value={stats?.safeSites.toLocaleString() || "0"}
          accent="green"
        />
        <Stat
          label="Avg Trust Score"
          value={stats?.averageTrustScore.toString() || "—"}
          accent="purple"
        />
      </div>
    </PageShell>
  );
}

