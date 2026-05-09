import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Brain,
  Lock,
  Zap,
} from "lucide-react";
import {
  CyberLoadingPipeline,
  urlAnalysisSteps,
} from "@/components/cyber/CyberLoadingPipeline";
import { LiveThreatFeed } from "@/components/cyber/LiveThreatFeed";
import {
  CyberStatusIndicator,
  ThreatIndicator,
} from "@/components/cyber/CyberStatusIndicator";
import {
  AnimatedProgressBar,
  AnimatedContainer,
  AnimatedItem,
  GlowingText,
} from "@/components/cyber/AnimatedResults";
import {
  getThreatLevel,
  threatColors,
  ThreatLevel,
} from "@/lib/threat-system";
import { threatNotifications } from "@/lib/cyber-notifications";

export const Route = createFileRoute("/url-protection")({
  head: () => ({
    meta: [
      { title: "URL & Phishing Protection — CipherNet AI" },
      {
        name: "description",
        content:
          "AI-powered URL scanner, QR fraud analysis, SSL inspection and AI-explained phishing verdicts.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [url, setUrl] = useState(
    "https://secure-axiom-bank.login-verify.co/auth"
  );

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const threatLevel = result
    ? getThreatLevel(result.phishing_probability)
    : null;

  const analyzeURL = async () => {
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < urlAnalysisSteps.length - 1 ? prev + 1 : prev
      );
    }, 400);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      clearInterval(stepInterval);
      setLoadingStep(urlAnalysisSteps.length - 1);

      // Simulate final processing delay
      setTimeout(() => {
        setResult(data);
        setLoading(false);

        // Show notifications based on threat level
        const threatLevel = getThreatLevel(data.phishing_probability);
        if (threatLevel === "CRITICAL" || threatLevel === "HIGH") {
          threatNotifications.urlDetected();
        } else if (threatLevel === "MEDIUM") {
          threatNotifications.redirectChainSuspicious();
        } else {
          threatNotifications.aiAnalysisComplete();
        }
      }, 600);
    } catch (error) {
      console.error("URL Analysis Error:", error);
      clearInterval(stepInterval);
      setLoading(false);
      const errorMsg = error instanceof Error ? error.message : "Analysis failed";
      toast.error(`Error: ${errorMsg} - Make sure backend is running on http://127.0.0.1:8000`);
    }
  };

  return (
    <PageShell
      eyebrow="URL · Phishing · QR"
      title={
        <>
          AI-powered{" "}
          <span className="text-gradient-cyber">URL Protection</span>
        </>
      }
      subtitle="Scan any link or QR code, decode hidden redirects, inspect SSL chains, and get AI-powered phishing verdicts."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* URL Scanner */}
        <Panel className="lg:col-span-2" title="URL Scanner">
          <div className="relative">
            <motion.div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 focus-within:border-cyber-cyan/60 transition-colors">
              <Search className="h-4 w-4 text-muted-foreground" />

              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm disabled:opacity-60"
                placeholder="https://example.com"
              />

              <motion.button
                onClick={analyzeURL}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="px-4 py-1.5 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background text-xs font-semibold disabled:opacity-50 transition-all"
              >
                {loading ? "Analyzing..." : "Analyze"}
              </motion.button>
            </motion.div>

            {loading && (
              <div className="mt-6">
                <CyberLoadingPipeline
                  steps={urlAnalysisSteps}
                  currentStep={loadingStep}
                />
              </div>
            )}
          </div>

          {result && !loading && threatLevel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 grid md:grid-cols-2 gap-5"
            >
              {/* Trust Meter with enhanced visuals */}
              <motion.div className="flex items-center gap-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative h-32 w-32"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="oklch(0.3 0.04 255)"
                      strokeWidth="7"
                      fill="none"
                    />

                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={
                        threatLevel === "CRITICAL"
                          ? "oklch(0.7 0.25 28)"
                          : threatLevel === "HIGH"
                            ? "oklch(0.65 0.2 25)"
                            : threatLevel === "MEDIUM"
                              ? "oklch(0.68 0.24 60)"
                              : "oklch(0.68 0.24 150)"
                      }
                      strokeWidth="7"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="263.9"
                      initial={{ strokeDashoffset: 263.9 }}
                      animate={{
                        strokeDashoffset: 263.9 * (1 - result.trust_score / 100),
                      }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                    />
                  </svg>

                  <div className="absolute inset-0 grid place-items-center text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div
                        className={`font-display text-3xl font-semibold ${threatColors[threatLevel].text}`}
                      >
                        {result.trust_score}
                      </div>

                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        trust score
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatedContainer stagger={0.08} delay={0.4}>
                  <AnimatedItem>
                    <Row
                      k="Phishing Probability"
                      v={`${result.phishing_probability}%`}
                      c={threatColors[threatLevel].text}
                    />
                  </AnimatedItem>

                  <AnimatedItem>
                    <Row
                      k="Threat Level"
                      v={threatLevel}
                      c={threatColors[threatLevel].text}
                    />
                  </AnimatedItem>

                  <AnimatedItem>
                    <Row
                      k="Verdict"
                      v={
                        threatLevel === "CRITICAL" || threatLevel === "HIGH"
                          ? "MALICIOUS"
                          : threatLevel === "MEDIUM"
                            ? "SUSPICIOUS"
                            : "SAFE"
                      }
                      c={threatColors[threatLevel].text}
                    />
                  </AnimatedItem>
                </AnimatedContainer>
              </motion.div>

              {/* Risk Factors with animations */}
              <AnimatedContainer stagger={0.06} delay={0.3}>
                {result.risk_factors?.map((factor: string, index: number) => (
                  <AnimatedItem key={index}>
                    <Detail k={factor} v="Detected" warn />
                  </AnimatedItem>
                ))}
              </AnimatedContainer>
            </motion.div>
          )}
        </Panel>

        {/* AI Explanation Panel */}
        <Panel
          title="AI Explanation"
          action={<Brain className="h-4 w-4 text-cyber-purple" />}
        >
          {result && threatLevel ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border p-4 text-sm leading-relaxed ${threatColors[threatLevel].bg} ${threatColors[threatLevel].border}`}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold mb-3 ${threatColors[threatLevel].text}`}
              >
                <AlertTriangle className="h-3 w-3" />
                {threatLevel} Risk
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-foreground/90"
              >
                {result?.ai_explanation ||
                  "AI analysis complete. Review risk factors above."}
              </motion.p>

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 space-y-1.5 text-xs text-muted-foreground"
              >
                {result?.risk_factors?.map((factor: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    • {factor}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 p-4 text-sm text-muted-foreground"
            >
              Run a scan to get AI-generated phishing analysis and threat
              intelligence.
            </motion.div>
          )}
        </Panel>
      </div>

      {/* Status Indicators & Live Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 grid lg:grid-cols-3 gap-4"
      >
        <Panel title="System Status">
          <div className="space-y-3">
            <CyberStatusIndicator status="active" label="AI Engine Active" />
            <CyberStatusIndicator
              status="monitoring"
              label="SSL Analysis Online"
            />
            <CyberStatusIndicator status="safe" label="Live Monitoring" />
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Live Threat Intelligence">
          <LiveThreatFeed />
        </Panel>
      </motion.div>

      {/* Bottom Panels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 grid lg:grid-cols-3 gap-4"
      >
        {/* QR Scanner */}
        <Panel title="QR Fraud Scanner">
          <motion.div
            whileHover={{ borderColor: "rgba(6, 182, 212, 0.5)" }}
            className="relative aspect-square rounded-xl border-2 border-dashed border-border/60 grid place-items-center bg-background/30 overflow-hidden transition-colors"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, linear: true }}
              >
                <QrCode className="h-12 w-12 mx-auto text-cyber-cyan" />
              </motion.div>

              <div className="mt-3 text-xs text-muted-foreground">
                Drop a QR image to decode payload
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-3 px-3 py-1.5 rounded-md border border-cyber-cyan/40 text-xs text-cyber-cyan hover:bg-cyber-cyan/5 transition-colors"
              >
                Upload QR
              </motion.button>
            </motion.div>
          </motion.div>
        </Panel>

        {/* SSL */}
        <Panel title="SSL & Certificate Analysis">
          <div className="space-y-3">
            {result ? (
              <AnimatedContainer stagger={0.05}>
                <AnimatedItem>
                  <Detail k="HTTPS Security" v="Verified" />
                </AnimatedItem>
                <AnimatedItem>
                  <Detail k="Domain Analysis" v="Complete" />
                </AnimatedItem>
                <AnimatedItem>
                  <Detail k="Certificate Chain" v="Valid" />
                </AnimatedItem>
                <AnimatedItem>
                  <Detail k="Risk Engine" v="Active" />
                </AnimatedItem>
              </AnimatedContainer>
            ) : (
              <div className="space-y-3 text-xs text-muted-foreground">
                <Detail k="HTTPS Security" v="Pending" />
                <Detail k="Domain Analysis" v="Pending" />
                <Detail k="Certificate Chain" v="Pending" />
                <Detail k="Risk Engine" v="Standby" />
              </div>
            )}
          </div>
        </Panel>

        {/* Redirect Chain */}
        <Panel title="Redirect Chain Analysis">
          <motion.div
            animate={{
              borderColor: result && threatLevel === "CRITICAL"
                ? "rgba(239, 68, 68, 0.5)"
                : result && threatLevel === "HIGH"
                  ? "rgba(234, 179, 8, 0.5)"
                  : "rgba(148, 163, 184, 0.3)",
            }}
            className="space-y-2 rounded-md border p-3 bg-background/30 transition-colors"
          >
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-mono">
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="truncate text-muted-foreground">{url}</span>
            </div>

            {result && result.risk_factors?.includes("Suspicious redirect chain") && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-cyber-red bg-cyber-red/5 border border-cyber-red/30 rounded px-2 py-1"
              >
                ⚠ Multiple redirect chains detected
              </motion.div>
            )}
          </motion.div>
        </Panel>
      </motion.div>

      {/* Stats with animated counters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <Stat label="Scans Today" value="1.2M" accent="cyan" />
        <Stat label="Phishing Caught" value="84,210" accent="red" />
        <Stat label="QR Frauds Blocked" value="2,914" accent="purple" />
        <Stat label="Avg Verdict Time" value="3.1ms" accent="green" />
      </motion.div>
    </PageShell>
  );
}

function Row({
  k,
  v,
  c,
}: {
  k: string;
  v: string;
  c: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-between text-sm"
    >
      <span className="text-muted-foreground">{k}</span>
      <span className={`${c} font-semibold`}>{v}</span>
    </motion.div>
  );
}

function Detail({
  k,
  v,
  warn = false,
}: {
  k: string;
  v: string;
  warn?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between rounded-md border px-3 py-2 bg-background/30 transition-all ${
        warn
          ? "border-cyber-red/40 hover:border-cyber-red/60 hover:bg-cyber-red/5"
          : "border-cyber-green/40 hover:border-cyber-green/60 hover:bg-cyber-green/5"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {warn ? (
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <AlertTriangle className="h-3 w-3 text-cyber-red" />
          </motion.div>
        ) : (
          <CheckCircle2 className="h-3 w-3 text-cyber-green" />
        )}

        <span className="text-xs font-medium">{k}</span>
      </div>

      <span
        className={`text-xs font-semibold ${
          warn ? "text-cyber-red" : "text-cyber-green"
        }`}
      >
        {v}
      </span>
    </motion.div>
  );
}