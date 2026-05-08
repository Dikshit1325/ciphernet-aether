import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Stat, Panel } from "@/components/site/PageShell";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AlertTriangle, Shield, Brain, Globe, Activity, Zap } from "lucide-react";

export const Route = createFileRoute("/threat-intelligence")({
  head: () => ({
    meta: [
      { title: "Threat Intelligence Center — CipherNet AI" },
      { name: "description", content: "Live threat feed, AI correlation engine, scam intelligence network and a global SOC command center." },
      { property: "og:title", content: "Threat Intelligence Center — CipherNet AI" },
      { property: "og:description", content: "Live threat feed, AI correlation engine and global SOC command center." },
    ],
  }),
  component: Page,
});

const feedData = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}h`,
  v: Math.round(120 + Math.sin(i / 2) * 60 + Math.random() * 80),
  b: Math.round(60 + Math.cos(i / 3) * 40 + Math.random() * 30),
}));

const liveFeed = [
  { sev: "critical", t: "Credential phishing kit cluster — 14 domains", src: "Asia-Pac", time: "0s" },
  { sev: "high", t: "Voice clone targeting CFO — Northwind Bank", src: "London", time: "12s" },
  { sev: "med", t: "Malicious QR campaign on transit posters", src: "Berlin", time: "47s" },
  { sev: "high", t: "Deepfake video on social — exec impersonation", src: "São Paulo", time: "1m" },
  { sev: "low", t: "Typosquat domain registered: ciph3rnet.io", src: "Global", time: "2m" },
  { sev: "critical", t: "Scam SMS surge — fake parcel delivery", src: "EU", time: "3m" },
];

const sevColor: Record<string,string> = {
  critical: "text-cyber-red border-cyber-red/40 bg-cyber-red/5",
  high: "text-cyber-purple border-cyber-purple/40 bg-cyber-purple/5",
  med: "text-cyber-cyan border-cyber-cyan/40 bg-cyber-cyan/5",
  low: "text-muted-foreground border-border bg-muted/30",
};

const regions = [
  { name: "North America", v: 82 }, { name: "Europe", v: 71 }, { name: "Asia Pacific", v: 94 },
  { name: "South America", v: 56 }, { name: "Africa", v: 48 }, { name: "Middle East", v: 63 },
];

function Page() {
  return (
    <PageShell
      eyebrow="Cyber Command Center"
      title={<>Threat <span className="text-gradient-cyber">Intelligence</span> Center</>}
      subtitle="A unified operating picture across the global threat landscape — live feeds, AI correlation, and the federated scam intelligence network."
    >
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Stat label="Active Threats" value="2,841" accent="red" sub="+12% last 24h" />
        <Stat label="Threats Blocked" value="412K" accent="cyan" sub="last 24h" />
        <Stat label="AI Confidence" value="98.4%" accent="green" sub="model v4.0" />
        <Stat label="Scam Attempts" value="18,302" accent="purple" sub="last 24h" />
        <Stat label="High-Risk Domains" value="6,124" accent="red" sub="under watch" />
        <Stat label="Fraud Alerts" value="932" accent="cyan" sub="real-time" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="AI Threat Timeline" action={<span className="text-[10px] text-cyber-green flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyber-green pulse-dot text-cyber-green" />STREAMING</span>}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feedData}>
                <defs>
                  <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.16 205)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.85 0.16 205)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: "oklch(0.55 0.02 250)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 255)", border: "1px solid oklch(0.3 0.04 255)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.85 0.16 205)" strokeWidth={2} fill="url(#a)" />
                <Area type="monotone" dataKey="b" stroke="oklch(0.65 0.22 295)" strokeWidth={2} fill="url(#b)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyber-cyan" /> Detected</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyber-purple" /> Blocked</div>
            <div className="flex items-center gap-2 text-muted-foreground">Window: 24h rolling</div>
          </div>
        </Panel>

        <Panel title="Live Threat Feed">
          <div className="space-y-2 max-h-72 overflow-hidden">
            {liveFeed.map((f, i) => (
              <motion.div key={i} initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.06 }} className={`rounded-md border px-3 py-2 ${sevColor[f.sev]}`}>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-80">
                  <span>{f.sev}</span><span>{f.time}</span>
                </div>
                <div className="text-xs text-foreground mt-1">{f.t}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{f.src}</div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Threat Heatmap — Regional Risk">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {regions.map((r) => (
              <div key={r.name} className="rounded-lg border border-border/60 p-4 bg-background/30 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 100%, oklch(${0.5 + r.v/300} 0.22 ${20 + r.v}), transparent 70%)` }} />
                <div className="relative">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Globe className="h-3 w-3" />{r.name}</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className="font-display text-2xl font-semibold text-cyber-cyan">{r.v}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">risk index</div>
                  </div>
                  <div className="mt-3 h-1 rounded bg-muted/50 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Risk Clusters">
          <div className="space-y-3">
            {[
              { i: AlertTriangle, c:"text-cyber-red", t:"Banking phishing kits", n:142 },
              { i: Brain, c:"text-cyber-purple", t:"AI voice clone ops", n:67 },
              { i: Shield, c:"text-cyber-cyan", t:"QR fraud campaigns", n:39 },
              { i: Activity, c:"text-cyber-green", t:"Pig-butchering rings", n:18 },
            ].map((c) => (
              <div key={c.t} className="flex items-center justify-between rounded-md border border-border/50 p-3">
                <div className="flex items-center gap-3"><c.i className={`h-4 w-4 ${c.c}`} /><span className="text-sm">{c.t}</span></div>
                <div className="font-display text-sm">{c.n}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Panel title="Threat Correlation Engine">
          <svg viewBox="0 0 400 220" className="w-full h-56">
            {[[200,110],[80,60],[320,60],[80,170],[320,170],[200,30],[200,200]].slice(1).map(([x,y], i) => (
              <line key={i} x1={200} y1={110} x2={x} y2={y} stroke="oklch(0.85 0.16 205 / 0.3)" strokeWidth="1" strokeDasharray="3 3" />
            ))}
            {[[200,110,"AI Core","cyber-cyan"],[80,60,"URL","cyber-blue"],[320,60,"QR","cyber-purple"],[80,170,"Voice","cyber-purple"],[320,170,"Video","cyber-blue"],[200,30,"SMS","cyber-green"],[200,200,"Trust","cyber-cyan"]].map(([x,y,t], i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r={i===0?22:14} fill="oklch(0.16 0.03 255)" stroke="oklch(0.85 0.16 205 / 0.6)" strokeWidth="1.5" />
                <text x={x as number} y={(y as number)+(i===0?4:32)} textAnchor="middle" fill="oklch(0.85 0.16 205)" fontSize="10" fontFamily="Space Grotesk">{t}</text>
              </g>
            ))}
          </svg>
          <p className="text-xs text-muted-foreground">Cross-modal signals are fused into a single threat verdict via the federated correlation graph.</p>
        </Panel>

        <Panel title="AI-Generated Threat Report">
          <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 p-4">
            <div className="flex items-center gap-2 text-cyber-cyan text-xs uppercase tracking-widest"><Zap className="h-3 w-3" /> Auto-Brief • 14:32 UTC</div>
            <div className="mt-3 text-sm leading-relaxed text-foreground/90">
              In the past 6 hours, CipherNet observed a coordinated <span className="text-cyber-purple">credential phishing</span> campaign targeting 14 financial domains across EMEA. The cluster shares a Russian hosting ASN and uses identical CSS fingerprints, suggesting a single threat actor (<span className="text-cyber-cyan">conf: 96%</span>). Recommended action: pre-emptively block the ASN at perimeter and enable MFA challenge on detected user-agents.
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1.5 rounded-md bg-cyber-cyan text-background text-xs font-semibold">Apply Mitigation</button>
              <button className="px-3 py-1.5 rounded-md border border-border/60 text-xs">Export STIX</button>
            </div>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
