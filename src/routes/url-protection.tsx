import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Brain,
} from "lucide-react";

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

  const [result, setResult] = useState<any>(null);

  const analyzeURL = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
          }),
        }
      );
      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
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
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />

              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="https://example.com"
              />

              <button
                onClick={analyzeURL}
                className="px-4 py-1.5 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background text-xs font-semibold"
              >
                Analyze
              </button>
            </div>

            {loading && (
              <div className="mt-4 text-cyber-cyan text-sm">
                Analyzing cyber threat...
              </div>
            )}
          </div>

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 grid md:grid-cols-2 gap-5"
            >
              {/* Trust Meter */}
              <div className="flex items-center gap-5">
                <div className="relative h-32 w-32">
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

                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="oklch(0.68 0.24 22)"
                      strokeWidth="7"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="263.9"
                      strokeDashoffset={
                        263.9 * (1 - result.trust_score / 100)
                      }
                    />
                  </svg>

                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <div className="font-display text-3xl font-semibold text-cyber-red">
                        {result.trust_score}
                      </div>

                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        trust score
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-sm">
                  <Row
                    k="Phishing Probability"
                    v={`${result.phishing_probability}%`}
                    c="text-cyber-red"
                  />

                  <Row
                    k="Threat Level"
                    v={result.threat_level}
                    c="text-cyber-red"
                  />

                  <Row
                    k="Verdict"
                    v={
                      result.threat_level === "HIGH"
                        ? "Malicious"
                        : "Suspicious"
                    }
                    c="text-cyber-red"
                  />
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-2 text-xs">
                {result.risk_factors?.map(
                  (factor: string, index: number) => (
                    <Detail key={index} k={factor} v="Detected" warn />
                  )
                )}
              </div>
            </motion.div>
          )}
        </Panel>

        {/* AI Explanation */}
        <Panel
          title="AI Explanation"
          action={<Brain className="h-4 w-4 text-cyber-purple" />}
        >
          <div className="rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-4 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-cyber-red text-[10px] uppercase tracking-widest">
              <AlertTriangle className="h-3 w-3" />
              {result?.threat_level || "No Scan"}
            </div>

            <p className="mt-3 text-foreground/90">
              {result?.ai_explanation ||
                "Run a scan to get AI-generated phishing analysis."}
            </p>

            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              {result?.risk_factors?.map(
                (factor: string, index: number) => (
                  <li key={index}>• {factor}</li>
                )
              )}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Bottom Panels */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* QR Scanner */}
        <Panel title="QR Fraud Scanner">
          <div className="relative aspect-square rounded-xl border-2 border-dashed border-border/60 grid place-items-center bg-background/30 overflow-hidden">
            <div className="relative text-center">
              <QrCode className="h-12 w-12 mx-auto text-cyber-cyan" />

              <div className="mt-3 text-xs text-muted-foreground">
                Drop a QR image to decode payload
              </div>

              <button className="mt-3 px-3 py-1.5 rounded-md border border-cyber-cyan/40 text-xs text-cyber-cyan">
                Upload QR
              </button>
            </div>
          </div>
        </Panel>

        {/* SSL */}
        <Panel title="SSL & Certificate Analysis">
          <div className="space-y-3 text-xs">
            <Detail k="HTTPS Security" v="Checked" />
            <Detail k="Domain Analysis" v="Active" />
            <Detail k="Keyword Detection" v="Enabled" />
            <Detail k="Risk Engine" v="Running" />
          </div>
        </Panel>

        {/* Redirect Chain */}
        <Panel title="Redirect Chain">
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-xs font-mono">
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-cyber-red">{url}</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Scans Today" value="1.2M" accent="cyan" />
        <Stat label="Phishing Caught" value="84,210" accent="red" />
        <Stat label="QR Frauds Blocked" value="2,914" accent="purple" />
        <Stat label="Avg Verdict Time" value="3.1ms" accent="green" />
      </div>
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
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={`${c} font-medium`}>{v}</span>
    </div>
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
    <div className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2 bg-background/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        {warn ? (
          <AlertTriangle className="h-3 w-3 text-cyber-red" />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-cyber-green" />
        )}

        {k}
      </div>

      <span className={warn ? "text-cyber-red" : "text-cyber-green"}>
        {v}
      </span>
    </div>
  );
}