import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { motion } from "framer-motion";
import { Chrome, Shield, AlertOctagon, CheckCircle2, X, Flag } from "lucide-react";

export const Route = createFileRoute("/browser-shield")({
  head: () => ({
    meta: [
      { title: "Browser Shield Dashboard — CipherNet AI" },
      { name: "description", content: "Real-time browser protection: live phishing alerts, trust scores and AI-powered website blocking." },
      { property: "og:title", content: "Browser Shield Dashboard — CipherNet AI" },
      { property: "og:description", content: "Live browser protection with AI-powered website blocking." },
    ],
  }),
  component: Page,
});

const blocked = [
  { d: "secure-axiom-bank.login-verify.co", c: "Phishing", t: "0:12" },
  { d: "free-iphone-claim.win", c: "Scam", t: "0:38" },
  { d: "ciph3rnet.io", c: "Typosquat", t: "1:24" },
  { d: "wallet-restore-metamask.app", c: "Crypto Phish", t: "2:08" },
  { d: "deepfake-celeb-leak.tv", c: "Malware", t: "3:51" },
];

function Page() {
  return (
    <PageShell
      eyebrow="Browser Defense"
      title={<>Browser <span className="text-gradient-cyber">Shield</span> Dashboard</>}
      subtitle="Your in-browser AI co-pilot — blocking phishing pages before they load, scoring every site you visit, and explaining why."
    >
      <div className="grid lg:grid-cols-5 gap-4">
        {/* extension popup mock */}
        <Panel className="lg:col-span-2" title="Extension Popup">
          <div className="mx-auto max-w-[320px] rounded-2xl glass-strong glow-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple grid place-items-center"><Shield className="h-4 w-4 text-background" /></div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold">CipherNet Shield</div>
                  <div className="text-[10px] text-cyber-green">Active · v4.0</div>
                </div>
              </div>
              <Chrome className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 rounded-lg border border-cyber-red/40 bg-cyber-red/10 p-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cyber-red">
                <span>Threat Detected</span><span>now</span>
              </div>
              <div className="mt-2 text-xs font-mono break-all">secure-axiom-bank.login-verify.co</div>
            </div>
            {/* meter */}
            <div className="mt-4 grid grid-cols-2 gap-3 items-center">
              <div className="relative h-24 w-24 mx-auto">
                <svg viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 255)" strokeWidth="6" fill="none" />
                  <motion.circle cx="50" cy="50" r="42" stroke="oklch(0.68 0.24 22)" strokeWidth="6" fill="none" strokeLinecap="round"
                    strokeDasharray="263.9" initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 * 0.86 }} transition={{ duration: 1.2 }} />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="font-display text-xl font-semibold text-cyber-red">14</div>
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground">trust</div>
                  </div>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Phishing</span><span className="text-cyber-red">92%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Domain</span><span className="text-cyber-red">4d old</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SSL</span><span className="text-cyber-red">Auto</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="text-cyber-cyan">97%</span></div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
              Brand impersonation of <span className="text-cyber-cyan">Axiom Bank</span> with hidden redirects. We strongly recommend leaving this page.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button className="px-2 py-2 rounded-md bg-cyber-red text-background text-[11px] font-semibold flex items-center justify-center gap-1"><X className="h-3 w-3" /> Block</button>
              <button className="px-2 py-2 rounded-md border border-border/60 text-[11px] flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Continue</button>
              <button className="px-2 py-2 rounded-md border border-border/60 text-[11px] flex items-center justify-center gap-1"><Flag className="h-3 w-3" /> Report</button>
            </div>
          </div>
        </Panel>

        {/* Live blocking feed */}
        <Panel className="lg:col-span-3" title="Real-Time Threat Blocking" action={<span className="text-[10px] text-cyber-green flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyber-green pulse-dot text-cyber-green" />LIVE</span>}>
          <div className="space-y-2">
            {blocked.map((b, i) => (
              <motion.div key={i} initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.08 }} className="flex items-center gap-3 rounded-md border border-border/50 bg-background/30 px-3 py-2.5">
                <div className="h-8 w-8 rounded-md bg-cyber-red/10 border border-cyber-red/30 grid place-items-center"><AlertOctagon className="h-4 w-4 text-cyber-red" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono truncate">{b.d}</div>
                  <div className="text-[10px] text-muted-foreground">Blocked · {b.c}</div>
                </div>
                <div className="text-[10px] text-muted-foreground">{b.t} ago</div>
                <span className="text-[10px] uppercase tracking-widest text-cyber-red border border-cyber-red/40 bg-cyber-red/5 rounded-full px-2 py-0.5">Stopped</span>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel title="Browser Trust Monitor">
          <div className="space-y-3">
            {[
              { d: "github.com", t: 96, c: "text-cyber-green" },
              { d: "stripe.com", t: 94, c: "text-cyber-green" },
              { d: "news-portal-ads.net", t: 42, c: "text-cyber-purple" },
              { d: "free-vpn-promo.cn", t: 18, c: "text-cyber-red" },
            ].map((s) => (
              <div key={s.d} className="flex items-center justify-between">
                <span className="text-xs font-mono">{s.d}</span>
                <span className={`text-xs font-semibold ${s.c}`}>{s.t}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Active Protection">
          <ul className="space-y-2 text-xs">
            {["Real-time URL scanning","Phishing kit fingerprinting","Crypto wallet drainer block","Ad-tracker filter","Malicious script sandbox","AI page intent analysis"].map((p) => (
              <li key={p} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-cyber-green" /> {p}</li>
            ))}
          </ul>
        </Panel>

        <Panel title="Today's Activity">
          <div className="grid grid-cols-2 gap-3">
            {[["Sites scanned","1,418"],["Threats blocked","27"],["Trackers stopped","3,201"],["Avg trust","87"]].map(([k,v]) => (
              <div key={k} className="rounded-md border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="mt-1 font-display text-xl text-cyber-cyan">{v}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Active Installs" value="3.4M" accent="cyan" />
        <Stat label="Pages Protected" value="1.2B" accent="green" />
        <Stat label="Blocked Today" value="184K" accent="red" />
        <Stat label="Avg Latency" value="12ms" accent="purple" />
      </div>
    </PageShell>
  );
}
