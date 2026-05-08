import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { useMemo, useState } from "react";
import { Brain, MessageSquareWarning, AlertTriangle, Briefcase, Shield } from "lucide-react";

export const Route = createFileRoute("/scam-detection")({
  head: () => ({
    meta: [
      { title: "Scam Detection Suite — CipherNet AI" },
      { name: "description", content: "NLP-driven scam detection for SMS, WhatsApp, fake recruiters and a full scam-impact simulator." },
      { property: "og:title", content: "Scam Detection Suite — CipherNet AI" },
      { property: "og:description", content: "NLP scam detection, fake recruiter analysis and impact simulation." },
    ],
  }),
  component: Page,
});

const SUS = ["blocked", "urgent", "verify", "click", "winner", "account", "suspended", "limited", "act now", "kyc", "otp"];

function Page() {
  const [msg, setMsg] = useState("URGENT: Your bank account will be BLOCKED in 24 hours. VERIFY your KYC immediately by clicking: http://axiom-bank-secure.co/login");

  const tokens = useMemo(() => {
    return msg.split(/(\s+)/).map((w, i) => {
      const low = w.toLowerCase();
      const isSus = SUS.some((s) => low.includes(s));
      return { w, sus: isSus, i };
    });
  }, [msg]);

  const susCount = tokens.filter((t) => t.sus).length;
  const score = Math.min(98, 30 + susCount * 12);

  return (
    <PageShell
      eyebrow="NLP Scam Intelligence"
      title={<>Scam <span className="text-gradient-cyber">Detection</span> Suite</>}
      subtitle="Identify manipulation tactics, urgency triggers, and credential-theft patterns across SMS, WhatsApp and fake recruitment messages."
    >
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Message Analyzer" action={<MessageSquareWarning className="h-4 w-4 text-cyber-purple" />}>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none focus:border-cyber-cyan/60 transition resize-none"
            placeholder="Paste an SMS / WhatsApp message…"
          />
          <div className="mt-4 rounded-lg border border-border/50 bg-background/30 p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Annotated Analysis</div>
            <p className="text-sm leading-relaxed">
              {tokens.map((t) =>
                t.sus ? (
                  <span key={t.i} className="bg-cyber-red/15 text-cyber-red rounded px-1 mx-0.5 border-b border-cyber-red/40">{t.w}</span>
                ) : (
                  <span key={t.i}>{t.w}</span>
                )
              )}
            </p>
          </div>
        </Panel>

        <Panel title="AI Verdict" action={<Brain className="h-4 w-4 text-cyber-purple" />}>
          <div className="text-center">
            <div className="font-display text-5xl font-semibold text-cyber-red">{score}%</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Scam probability</div>
          </div>
          <div className="mt-5 space-y-2 text-xs">
            <Bar k="Urgency Manipulation" v={92} />
            <Bar k="Authority Spoofing" v={84} />
            <Bar k="Credential Theft Risk" v={88} />
            <Bar k="Emotional Pressure" v={71} />
          </div>
          <div className="mt-5 rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-3 text-xs text-foreground/90">
            <span className="text-cyber-red font-semibold">Likely scam.</span> Combines urgency, authority impersonation and a malicious credential-collection URL.
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Panel title="Fake Recruiter Detection" action={<Briefcase className="h-4 w-4 text-cyber-cyan" />}>
          <div className="rounded-lg border border-border/50 p-4 bg-background/30 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-semibold">Sarah from "Helix Talent"</div>
                <div className="text-xs text-muted-foreground">via WhatsApp • +44 ••• 8127</div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-cyber-red border border-cyber-red/40 bg-cyber-red/5 rounded-full px-2 py-0.5">Fraud</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground italic">"We saw your profile — $4,500/week WFH role. Send your bank IFSC to onboard immediately."</div>
            <ul className="mt-4 space-y-1.5 text-xs">
              <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-cyber-red" /> Free-tier email + WhatsApp only</li>
              <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-cyber-red" /> Asks for banking credentials pre-interview</li>
              <li className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-cyber-red" /> Company "Helix Talent" registered 11 days ago</li>
            </ul>
          </div>
        </Panel>

        <Panel title="Scam Impact Simulator" action={<Shield className="h-4 w-4 text-cyber-cyan" />}>
          <div className="space-y-3 text-sm">
            <div className="text-xs text-muted-foreground">If the user falls for this scam, CipherNet projects:</div>
            {[
              { l: "Credential theft", v: 94, c: "from-cyber-red to-cyber-purple" },
              { l: "Banking fraud", v: 78, c: "from-cyber-red to-cyber-purple" },
              { l: "Session hijack", v: 61, c: "from-cyber-purple to-cyber-blue" },
              { l: "Identity exposure", v: 88, c: "from-cyber-red to-cyber-purple" },
            ].map((r) => (
              <div key={r.l}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{r.l}</span><span>{r.v}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${r.c}`} style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 rounded-md border border-cyber-cyan/30 bg-cyber-cyan/5 p-3 text-xs">
              Recommended: block sender, enforce step-up auth on linked accounts and notify SOC.
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Messages Scanned" value="9.4M" accent="cyan" />
        <Stat label="Scams Stopped" value="318K" accent="red" />
        <Stat label="Fake Jobs Flagged" value="14,210" accent="purple" />
        <Stat label="Languages" value="48" accent="green" />
      </div>
    </PageShell>
  );
}

function Bar({ k, v }: { k: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>{v}%</span></div>
      <div className="mt-1 h-1.5 rounded bg-muted/50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
