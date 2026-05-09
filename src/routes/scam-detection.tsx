import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Brain,
  MessageSquareWarning,
  AlertTriangle,
  Briefcase,
  Shield,
  Zap,
} from "lucide-react";
import {
  CyberLoadingPipeline,
  smsAnalysisSteps,
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
} from "@/components/cyber/AnimatedResults";
import {
  getThreatLevel,
  threatColors,
  ThreatLevel,
} from "@/lib/threat-system";
import { threatNotifications } from "@/lib/cyber-notifications";

export const Route = createFileRoute("/scam-detection")({
  head: () => ({
    meta: [
      { title: "Scam Detection Suite — CipherNet AI" },
      {
        name: "description",
        content:
          "NLP-driven scam detection for SMS, WhatsApp, fake recruiters and a full scam-impact simulator.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [msg, setMsg] = useState(
    "URGENT: Your bank account will be BLOCKED in 24 hours. VERIFY your KYC immediately by clicking: http://axiom-bank-secure.co/login"
  );

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const threatLevel = result
    ? getThreatLevel(result.scam_probability)
    : null;

  const analyzeSMS = async () => {
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < smsAnalysisSteps.length - 1 ? prev + 1 : prev
      );
    }, 350);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      clearInterval(stepInterval);
      setLoadingStep(smsAnalysisSteps.length - 1);

      // Simulate final processing delay
      setTimeout(() => {
        setResult(data);
        setLoading(false);

        // Show notifications based on threat level
        const threatLevel = getThreatLevel(data.scam_probability);
        if (threatLevel === "CRITICAL" || threatLevel === "HIGH") {
          threatNotifications.scamProbabilityHigh();
        } else if (threatLevel === "MEDIUM") {
          threatNotifications.spoofingDetected();
        } else {
          threatNotifications.aiAnalysisComplete();
        }
      }, 600);
    } catch (error) {
      console.error("SMS Analysis Error:", error);
      clearInterval(stepInterval);
      setLoading(false);
      const errorMsg = error instanceof Error ? error.message : "Analysis failed";
      toast.error(`Error: ${errorMsg} - Make sure backend is running on http://127.0.0.1:8000`);
    }
  };

  return (
    <PageShell
      eyebrow="NLP Scam Intelligence"
      title={
        <>
          Scam <span className="text-gradient-cyber">Detection</span> Suite
        </>
      }
      subtitle="Identify manipulation tactics, urgency triggers, and credential-theft patterns across SMS, WhatsApp and fake recruitment messages."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Message Analyzer */}
        <Panel
          className="lg:col-span-2"
          title="Message Analyzer"
          action={
            <MessageSquareWarning className="h-4 w-4 text-cyber-purple" />
          }
        >
          <motion.textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            disabled={loading}
            rows={5}
            className="w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none focus:border-cyber-cyan/60 transition resize-none disabled:opacity-60"
            placeholder="Paste an SMS / WhatsApp message…"
            whileFocus={{ borderColor: "rgba(6, 182, 212, 0.6)" }}
          />

          <motion.button
            onClick={analyzeSMS}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background text-sm font-semibold disabled:opacity-50 transition-all"
          >
            {loading ? "Analyzing..." : "Analyze Message"}
          </motion.button>

          {loading && (
            <div className="mt-6">
              <CyberLoadingPipeline
                steps={smsAnalysisSteps}
                currentStep={loadingStep}
              />
            </div>
          )}

          {/* Highlighted Words */}
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-border/50 bg-background/30 p-4"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                🎯 Detected Keywords
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2"
              >
                {result?.highlighted_words?.map(
                  (word: string, index: number) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-2.5 py-1.5 rounded-md bg-cyber-red/15 text-cyber-red text-xs border border-cyber-red/30 font-medium"
                    >
                      {word}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          )}
        </Panel>

        {/* AI Verdict */}
        <Panel
          title="AI Verdict"
          action={<Brain className="h-4 w-4 text-cyber-purple" />}
        >
          {result && threatLevel ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`font-display text-5xl font-semibold ${threatColors[threatLevel].text}`}
              >
                {result?.scam_probability}%
              </motion.div>

              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                Scam Probability
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground"
            >
              <div className="font-display text-4xl font-semibold opacity-40">
                --
              </div>
              <div className="text-[10px] uppercase tracking-widest mt-2">
                Awaiting Analysis
              </div>
            </motion.div>
          )}

          {result && threatLevel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-5 space-y-3 text-xs"
            >
              <Bar
                k="Urgency Manipulation"
                v={result?.urgency_score || 0}
                color="from-cyber-red to-orange-500"
              />

              <Bar
                k="Authority Spoofing"
                v={result?.authority_score || 0}
                color="from-orange-500 to-cyber-red"
              />

              <Bar
                k="Credential Theft Risk"
                v={result?.credential_theft_score || 0}
                color="from-cyber-red to-cyber-purple"
              />
            </motion.div>
          )}

          {result && threatLevel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mt-5 rounded-lg border p-3 text-xs leading-relaxed ${threatColors[threatLevel].bg} ${threatColors[threatLevel].border}`}
            >
              <span
                className={`font-semibold uppercase tracking-wide ${threatColors[threatLevel].text}`}
              >
                {threatLevel === "CRITICAL" || threatLevel === "HIGH"
                  ? "🚨 HIGH THREAT"
                  : threatLevel === "MEDIUM"
                    ? "⚠ MEDIUM THREAT"
                    : "✓ SAFE"}
              </span>

              <div className="mt-2 text-foreground/80">
                {result?.ai_explanation ||
                  "Advanced NLP analysis complete. Review risk indicators."}
              </div>
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
            <CyberStatusIndicator status="active" label="NLP Engine Active" />
            <CyberStatusIndicator
              status="monitoring"
              label="Fraud Detection Online"
            />
            <CyberStatusIndicator status="safe" label="Real-time Scanning" />
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="Live Threat Intelligence">
          <LiveThreatFeed />
        </Panel>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 grid lg:grid-cols-2 gap-4"
      >
        {/* Fake Recruiter */}
        <Panel
          title="Fake Recruiter Detection"
          action={<Briefcase className="h-4 w-4 text-cyber-cyan" />}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-border/50 p-4 bg-background/30 text-sm"
          >
            <motion.div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="font-display font-semibold">
                  Sarah from "Helix Talent"
                </div>

                <div className="text-xs text-muted-foreground">
                  via WhatsApp • +44 ••• 8127
                </div>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] uppercase tracking-widest text-cyber-red border border-cyber-red/40 bg-cyber-red/10 rounded-full px-2.5 py-1 font-semibold"
              >
                🚨 Fraud
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-xs text-muted-foreground italic border-l-2 border-cyber-red/40 pl-3"
            >
              "We saw your profile — $4,500/week WFH role. Send your bank
              IFSC to onboard immediately."
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, staggerChildren: 0.05 }}
              className="mt-4 space-y-2 text-xs"
            >
              {[
                "Free-tier email + WhatsApp only",
                "Asks for banking credentials pre-interview",
                "Company registered recently",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-shrink-0"
                  >
                    <AlertTriangle className="h-3 w-3 text-cyber-red" />
                  </motion.div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </Panel>

        {/* Scam Impact Simulator */}
        <Panel
          title="Scam Impact Simulator"
          action={<Shield className="h-4 w-4 text-cyber-cyan" />}
        >
          <motion.div className="space-y-4 text-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground bg-background/30 rounded px-3 py-2"
            >
              If the user falls for this scam, CipherNet projects:
            </motion.div>

            <AnimatedContainer stagger={0.08} delay={0.2}>
              {[
                {
                  l: "Credential Theft Risk",
                  v: 94,
                  c: "from-cyber-red to-cyber-purple",
                },
                {
                  l: "Banking Fraud Probability",
                  v: 78,
                  c: "from-cyber-red to-orange-500",
                },
                {
                  l: "Session Hijacking Risk",
                  v: 61,
                  c: "from-cyber-purple to-cyber-blue",
                },
                {
                  l: "Identity Exposure Level",
                  v: 88,
                  c: "from-cyber-red to-cyber-purple",
                },
              ].map((r) => (
                <AnimatedItem key={r.l}>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">
                        {r.l}
                      </span>

                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-semibold text-cyber-red"
                      >
                        {r.v}%
                      </motion.span>
                    </div>

                    <AnimatedProgressBar value={r.v} gradient={r.c} />
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedContainer>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 rounded-md border border-cyber-cyan/30 bg-cyber-cyan/5 p-3 text-xs text-muted-foreground"
            >
              <div className="font-semibold text-cyber-cyan mb-1">
                🛡 Recommended Actions
              </div>
              Block sender, enforce step-up authentication and notify security
              team.
            </motion.div>
          </motion.div>
        </Panel>
      </motion.div>

      {/* Stats with animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <Stat label="Messages Scanned" value="9.4M" accent="cyan" />
        <Stat label="Scams Stopped" value="318K" accent="red" />
        <Stat label="Fake Jobs Flagged" value="14,210" accent="purple" />
        <Stat label="Languages" value="48" accent="green" />
      </motion.div>
    </PageShell>
  );
}

function Bar({
  k,
  v,
  color,
}: {
  k: string;
  v: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-muted-foreground font-medium">{k}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-semibold text-cyber-red"
        >
          {v}%
        </motion.span>
      </div>

      <AnimatedProgressBar value={v} gradient={color} />
    </motion.div>
  );
}