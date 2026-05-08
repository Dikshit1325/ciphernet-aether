import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { motion } from "framer-motion";
import { Brain, Eye, ShieldCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/trust-engine")({
  head: () => ({
    meta: [
      { title: "AI Trust Engine — CipherNet AI" },
      { name: "description", content: "A credit score for the internet — website trust, privacy risk, manipulation analysis and behavioral risk scoring." },
      { property: "og:title", content: "AI Trust Engine — CipherNet AI" },
      { property: "og:description", content: "A credit score for the internet — trust, privacy and manipulation analysis." },
    ],
  }),
  component: Page,
});

const ranked = [
  { d: "stripe.com", s: 96, p: 8, t: 4, m: 6 },
  { d: "github.com", s: 94, p: 12, t: 9, m: 5 },
  { d: "openai.com", s: 91, p: 18, t: 14, m: 11 },
  { d: "news-portal-ads.net", s: 41, p: 78, t: 84, m: 72 },
  { d: "free-vpn-promo.cn", s: 18, p: 92, t: 88, m: 94 },
  { d: "shop-hot-deals.win", s: 24, p: 86, t: 91, m: 89 },
];

function Page() {
  return (
    <PageShell
      eyebrow="A Credit Score for the Internet"
      title={<>AI <span className="text-gradient-cyber">Trust</span> Engine</>}
      subtitle="A unified trust, privacy and manipulation score for every site, app and interaction — powered by behavioral AI and a federated trust graph."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Headline trust */}
        <Panel className="lg:col-span-2" title="Sample Trust Profile" action={<ShieldCheck className="h-4 w-4 text-cyber-cyan" />}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 mx-auto w-56">
              <svg viewBox="0 0 100 100" className="-rotate-90">
                <circle cx="50" cy="50" r="44" stroke="oklch(0.3 0.04 255)" strokeWidth="4" fill="none" />
                <motion.circle cx="50" cy="50" r="44" stroke="url(#g2)" strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray="276.5" initial={{ strokeDashoffset: 276.5 }} animate={{ strokeDashoffset: 276.5 * 0.13 }} transition={{ duration: 1.6 }} />
                <defs>
                  <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.16 205)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Trust Score</div>
                  <div className="font-display text-5xl font-semibold text-gradient-cyber">87</div>
                  <div className="text-[10px] uppercase tracking-widest text-cyber-green mt-1">High Trust · A</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <Row k="Privacy Risk" v={22} good />
              <Row k="Tracking Score" v={31} />
              <Row k="Manipulation Index" v={18} good />
              <Row k="Behavioral Risk" v={14} good />
              <Row k="Dark Patterns" v={9} good />
            </div>
          </div>
        </Panel>

        <Panel title="Behavioral Risk Engine" action={<Brain className="h-4 w-4 text-cyber-purple" />}>
          <div className="space-y-2 text-xs">
            <Indicator label="Click-bait patterns" level="low" />
            <Indicator label="Coercive countdowns" level="med" />
            <Indicator label="Hidden opt-outs" level="low" />
            <Indicator label="Fake scarcity" level="low" />
            <Indicator label="Misleading CTAs" level="med" />
            <Indicator label="Privacy-policy obfuscation" level="low" />
          </div>
          <div className="mt-4 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 p-3 text-xs text-foreground/90">
            Site behaves transparently with minor cookie-banner friction.
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Websites Ranked by Trust">
          <div className="overflow-hidden rounded-md border border-border/50">
            <table className="w-full text-xs">
              <thead className="bg-background/40 text-muted-foreground uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="text-left px-3 py-2">Domain</th>
                  <th className="text-right px-3 py-2">Trust</th>
                  <th className="text-right px-3 py-2">Privacy</th>
                  <th className="text-right px-3 py-2">Tracking</th>
                  <th className="text-right px-3 py-2">Manipulation</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r) => (
                  <tr key={r.d} className="border-t border-border/40 hover:bg-background/30 transition">
                    <td className="px-3 py-2.5 font-mono">{r.d}</td>
                    <td className="px-3 py-2.5 text-right"><Badge v={r.s} invert /></td>
                    <td className="px-3 py-2.5 text-right"><Badge v={r.p} /></td>
                    <td className="px-3 py-2.5 text-right"><Badge v={r.t} /></td>
                    <td className="px-3 py-2.5 text-right"><Badge v={r.m} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Manipulation Heatmap" action={<Eye className="h-4 w-4 text-cyber-purple" />}>
          <div className="grid grid-cols-12 gap-[3px]">
            {Array.from({ length: 12 * 8 }).map((_, i) => {
              const v = Math.random();
              return <div key={i} className="aspect-square rounded-sm" style={{ background: `oklch(${0.25 + v*0.5} 0.18 ${15 + v*40} / ${0.25 + v*0.7})` }} />;
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <div className="flex-1 mx-3 h-1 rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-red" />
            <span>High</span>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Panel title="AI Trust Report">
          <div className="rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4 text-sm leading-relaxed">
            <div className="text-[10px] uppercase tracking-widest text-cyber-purple flex items-center gap-1.5"><Brain className="h-3 w-3" /> Generated by CipherNet</div>
            <p className="mt-2">
              The CipherNet Trust Engine fuses 240+ signals — domain provenance, tracker density, dark-pattern density, behavioral telemetry, and crowd-sourced reports — into a <span className="text-cyber-cyan">single normalized 0–100 score</span>. Use it to vet vendors, surface risk in real time, and protect end-users from manipulative interfaces.
            </p>
          </div>
        </Panel>

        <Panel title="User Trust Analytics">
          <div className="grid grid-cols-2 gap-3">
            {[["Avg portfolio trust","81"],["Sites under watch","42"],["High-risk visits","6"],["Mitigations taken","19"]].map(([k,v]) => (
              <div key={k} className="rounded-md border border-border/50 p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="mt-1 font-display text-2xl text-cyber-cyan">{v}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Domains Scored" value="48M" accent="cyan" />
        <Stat label="Signals Fused" value="240+" accent="purple" />
        <Stat label="Reports Today" value="98K" accent="green" />
        <Stat label="Confidence" value="98.6%" accent="cyan" />
      </div>
    </PageShell>
  );
}

function Row({ k, v, good=false }: { k: string; v: number; good?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{k}</span>
        <span className={good ? "text-cyber-green" : "text-cyber-cyan"}>{v}/100</span>
      </div>
      <div className="mt-1 h-1.5 rounded bg-muted/50 overflow-hidden">
        <div className={`h-full ${good ? "bg-cyber-green" : "bg-gradient-to-r from-cyber-cyan to-cyber-purple"}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function Badge({ v, invert = false }: { v: number; invert?: boolean }) {
  const high = invert ? v >= 70 : v <= 30;
  const low = invert ? v < 40 : v > 70;
  const c = high ? "text-cyber-green border-cyber-green/40 bg-cyber-green/5" : low ? "text-cyber-red border-cyber-red/40 bg-cyber-red/5" : "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5";
  return <span className={`inline-block rounded-full px-2 py-0.5 border text-[10px] font-medium ${c}`}>{v}</span>;
}

function Indicator({ label, level }: { label: string; level: "low"|"med"|"high" }) {
  const map = { low: "text-cyber-green", med: "text-cyber-cyan", high: "text-cyber-red" };
  const Icon = level === "high" ? AlertTriangle : ShieldCheck;
  return (
    <div className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2 bg-background/30">
      <span className="text-muted-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1.5 ${map[level]} uppercase tracking-widest text-[10px]`}>
        <Icon className="h-3 w-3" /> {level}
      </span>
    </div>
  );
}
