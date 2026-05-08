import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, QrCode, ShieldAlert, Lock, AlertTriangle, CheckCircle2, ArrowRight, Brain } from "lucide-react";

export const Route = createFileRoute("/url-protection")({
  head: () => ({
    meta: [
      { title: "URL & Phishing Protection — CipherNet AI" },
      { name: "description", content: "AI-powered URL scanner, QR fraud analysis, SSL inspection and AI-explained phishing verdicts." },
      { property: "og:title", content: "URL & Phishing Protection — CipherNet AI" },
      { property: "og:description", content: "AI-powered URL scanner, QR fraud analysis and AI-explained phishing verdicts." },
    ],
  }),
  component: Page,
});

function Page() {
  const [url, setUrl] = useState("https://secure-axiom-bank.login-verify.co/auth");
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(true);

  const scan = () => { setDone(false); setScanning(true); setTimeout(() => { setScanning(false); setDone(true); }, 1800); };

  const trust = 18;
  const phishing = 92;

  return (
    <PageShell
      eyebrow="URL · Phishing · QR"
      title={<>AI-powered <span className="text-gradient-cyber">URL Protection</span></>}
      subtitle="Scan any link or QR code, decode hidden redirects, inspect SSL chains, and get human-readable AI explanations for every verdict."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="URL Scanner">
          <div className="relative">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 focus-within:border-cyber-cyan/60 transition">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                placeholder="https://example.com"
              />
              <button onClick={scan} className="px-4 py-1.5 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background text-xs font-semibold">
                Analyze
              </button>
            </div>
            {scanning && (
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent scan-line" />
              </div>
            )}
          </div>

          {done && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid md:grid-cols-2 gap-5">
              {/* Trust meter */}
              <div className="flex items-center gap-5">
                <div className="relative h-32 w-32">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 255)" strokeWidth="7" fill="none" />
                    <circle cx="50" cy="50" r="42" stroke="oklch(0.68 0.24 22)" strokeWidth="7" fill="none" strokeLinecap="round"
                      strokeDasharray="263.9" strokeDashoffset={263.9 * (1 - trust/100)} />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <div className="font-display text-3xl font-semibold text-cyber-red">{trust}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">trust score</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  <Row k="Phishing Probability" v={`${phishing}%`} c="text-cyber-red" />
                  <Row k="Manipulation Risk" v="High" c="text-cyber-red" />
                  <Row k="AI Confidence" v="97.2%" c="text-cyber-cyan" />
                  <Row k="Verdict" v="Malicious" c="text-cyber-red" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <Detail k="Domain age" v="4 days" warn />
                <Detail k="SSL issuer" v="Let's Encrypt (auto)" warn />
                <Detail k="Hidden redirect" v="2 hops via .ru ASN" warn />
                <Detail k="Brand impersonation" v="Axiom Bank logo cloned" warn />
                <Detail k="Hosting ASN" v="AS49234 — flagged" warn />
                <Detail k="DNS records" v="No SPF / DMARC" warn />
              </div>
            </motion.div>
          )}
        </Panel>

        <Panel title="AI Explanation" action={<Brain className="h-4 w-4 text-cyber-purple" />}>
          <div className="rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-4 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-cyber-red text-[10px] uppercase tracking-widest"><AlertTriangle className="h-3 w-3" /> High Risk</div>
            <p className="mt-3 text-foreground/90">
              This URL impersonates <span className="text-cyber-cyan">Axiom Bank</span> using a recently registered look-alike domain. We detected suspicious banking keywords (<span className="text-cyber-purple">"login-verify"</span>), hidden multi-hop redirects, and a cloned brand logo. The SSL certificate was issued automatically with no organizational validation.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <li>• Suspicious keywords detected</li>
              <li>• Domain registered 4 days ago</li>
              <li>• Hidden redirect behavior to foreign ASN</li>
              <li>• Brand impersonation confidence 96%</li>
            </ul>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel title="QR Fraud Scanner">
          <div className="relative aspect-square rounded-xl border-2 border-dashed border-border/60 grid place-items-center bg-background/30 overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-30" />
            <div className="absolute inset-x-6 h-1 bg-cyber-cyan shadow-[0_0_20px_oklch(0.85_0.16_205)] scan-line" />
            <div className="relative text-center">
              <QrCode className="h-12 w-12 mx-auto text-cyber-cyan" />
              <div className="mt-3 text-xs text-muted-foreground">Drop a QR image to decode payload</div>
              <button className="mt-3 px-3 py-1.5 rounded-md border border-cyber-cyan/40 text-xs text-cyber-cyan">Upload QR</button>
            </div>
          </div>
        </Panel>

        <Panel title="SSL & Certificate Analysis">
          <div className="space-y-3 text-xs">
            <Detail k="TLS version" v="1.3" />
            <Detail k="Issuer" v="Let's Encrypt R3" warn />
            <Detail k="OV / EV" v="None" warn />
            <Detail k="Cert age" v="3 days" warn />
            <Detail k="HSTS" v="Disabled" warn />
            <Detail k="Cert chain" v="Valid (3 nodes)" />
          </div>
        </Panel>

        <Panel title="Redirect Chain">
          <div className="space-y-2">
            {[
              { url: "secure-axiom-bank.login-verify.co", c: "text-cyber-red" },
              { url: "→ trk.adnet-redir.io", c: "text-cyber-purple" },
              { url: "→ phish-dropper.ru/auth", c: "text-cyber-red" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-xs font-mono">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className={s.c}>{s.url}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Scans Today" value="1.2M" accent="cyan" />
        <Stat label="Phishing Caught" value="84,210" accent="red" />
        <Stat label="QR Frauds Blocked" value="2,914" accent="purple" />
        <Stat label="Avg Verdict Time" value="3.1ms" accent="green" />
      </div>
    </PageShell>
  );
}

function Row({ k, v, c }: { k: string; v: string; c: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={`${c} font-medium`}>{v}</span></div>;
}
function Detail({ k, v, warn=false }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2 bg-background/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        {warn ? <AlertTriangle className="h-3 w-3 text-cyber-red" /> : <CheckCircle2 className="h-3 w-3 text-cyber-green" />}
        {k}
      </div>
      <span className={warn ? "text-cyber-red" : "text-cyber-green"}>{v}</span>
    </div>
  );
}
