import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Globe, MessageSquareWarning, QrCode, Mic, Video, Chrome, Brain, ArrowRight, Activity, Lock, Zap, Eye, Sparkles, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CipherNet AI — Unified AI Cyber Defense Ecosystem" },
      { name: "description", content: "Detect phishing, fake QR payments, scam calls, deepfakes, malicious websites and digital fraud in real time with AI." },
      { property: "og:title", content: "CipherNet AI — Unified AI Cyber Defense Ecosystem" },
      { property: "og:description", content: "Detect phishing, fake QR payments, scam calls, deepfakes, malicious websites and digital fraud in real time with AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Globe, title: "Fake URL Detection", desc: "AI-driven phishing & malicious link analysis with domain trust scoring." },
  { icon: MessageSquareWarning, title: "Scam SMS Analysis", desc: "NLP detects manipulation, urgency tactics & credential-theft patterns." },
  { icon: QrCode, title: "QR Fraud Detection", desc: "Decode and inspect QR payloads for spoofed payments and redirects." },
  { icon: Mic, title: "Voice Scam Detection", desc: "Identify cloned voices and social-engineering call patterns in real time." },
  { icon: Video, title: "Deepfake Detection", desc: "Frame-level authenticity analysis with lip-sync and artifact scoring." },
  { icon: Chrome, title: "Browser Shield", desc: "In-browser AI co-pilot blocking phishing pages before they load." },
  { icon: Brain, title: "AI Threat Explanation", desc: "Human-readable reasoning for every threat verdict — no black box." },
  { icon: Activity, title: "Scam Intelligence", desc: "Federated threat graph correlating signals across the global network." },
];

function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 cyber-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-cyber-blue/20 blur-[140px]" />
        <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-cyber-purple/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cyber-cyan border border-cyber-cyan/30 rounded-full px-3 py-1 bg-cyber-cyan/5"
            >
              <Sparkles className="h-3 w-3" />
              AI Cyber Defense • v4.0 Live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
            >
              CipherNet <span className="text-gradient-cyber">AI</span>
              <span className="block text-2xl md:text-3xl font-medium text-muted-foreground mt-4 tracking-tight">
                Unified AI-Powered Cyber Defense<br/>& Threat Intelligence Ecosystem
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-muted-foreground text-base md:text-lg max-w-xl"
            >
              Detect phishing, fake QR payments, scam calls, deepfakes, malicious websites, and digital fraud in real time using advanced AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/url-protection" className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background font-semibold shadow-[0_0_30px_oklch(0.78_0.18_220_/_0.5)] hover:shadow-[0_0_45px_oklch(0.78_0.18_220_/_0.8)] transition-all">
                Start Protection <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link to="/threat-intelligence" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border/60 hover:border-cyber-cyan/60 hover:text-cyber-cyan transition font-medium">
                <Eye className="h-4 w-4" /> Watch Live Demo
              </Link>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[["12.4M", "Threats Blocked"], ["99.7%", "AI Accuracy"], ["180+", "Countries"]].map(([v,l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-semibold text-foreground">{v}</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HERO VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative glass-strong rounded-2xl p-6 glow-border float-slow">
              {/* scan line */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyber-cyan/15 to-transparent scan-line" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyber-cyan" />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Threat Console</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyber-green pulse-dot text-cyber-green" />
                  <span className="text-[11px] text-cyber-green">LIVE</span>
                </div>
              </div>

              {/* Trust meter ring */}
              <div className="mt-6 flex items-center gap-5">
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" stroke="oklch(0.3 0.04 255)" strokeWidth="6" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="42" stroke="url(#g)" strokeWidth="6" fill="none" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 0.94 }} transition={{ duration: 1.6, delay: 0.5 }}
                      style={{ pathLength: 0.94 }}
                      strokeDasharray="263.9"
                      strokeDashoffset={263.9 * 0.06}
                    />
                    <defs>
                      <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0%" stopColor="oklch(0.85 0.16 205)" />
                        <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="font-display text-2xl font-semibold text-cyber-cyan">94</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Trust</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { l: "Phishing Probability", v: "2%", c: "text-cyber-green" },
                    { l: "Domain Reputation", v: "High", c: "text-cyber-cyan" },
                    { l: "AI Confidence", v: "98.4%", c: "text-cyber-cyan" },
                  ].map((r) => (
                    <div key={r.l} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{r.l}</span>
                      <span className={r.c + " font-medium"}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live alerts */}
              <div className="mt-5 space-y-2">
                {[
                  { c: "text-cyber-red", i: AlertTriangle, t: "Spoofed payment QR — blocked", s: "0.4s ago" },
                  { c: "text-cyber-purple", i: Brain, t: "Voice clone detected (97%)", s: "2s ago" },
                  { c: "text-cyber-green", i: Lock, t: "tls handshake verified", s: "5s ago" },
                ].map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.15 }} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2">
                    <a.i className={`h-3.5 w-3.5 ${a.c}`} />
                    <div className="text-xs flex-1">{a.t}</div>
                    <div className="text-[10px] text-muted-foreground">{a.s}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay: 0.9 }} className="absolute -left-6 -bottom-6 glass rounded-xl px-4 py-3 glow-border hidden md:flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyber-cyan" />
              <div className="text-xs"><span className="font-semibold text-cyber-cyan">3.2ms</span> avg verdict</div>
            </motion.div>
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay: 1.05 }} className="absolute -right-4 top-10 glass rounded-xl px-4 py-3 glow-border hidden md:flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyber-purple" />
              <div className="text-xs">Multi-modal AI</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="relative border-y border-border/40 bg-background/40">
        <div className="mx-auto max-w-[1400px] px-6 py-8 flex flex-wrap items-center gap-x-12 gap-y-4 justify-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Trusted in production by</span>
          {["NORTHWIND", "AXIOM BANK", "HELIX LABS", "ORBIT.IO", "QUANTUM SEC", "VANTA"].map((n) => (
            <span key={n} className="font-display text-sm tracking-[0.2em] text-muted-foreground/70 hover:text-foreground transition">{n}</span>
          ))}
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-cyber-cyan">Core Capabilities</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">One platform. <span className="text-gradient-cyber">Every threat surface.</span></h2>
          </div>
          <p className="text-muted-foreground max-w-md">Eight AI-native defense modules unified by a single threat graph and trust engine.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-5 glow-border group transition-all hover:shadow-[0_0_30px_oklch(0.78_0.18_220_/_0.25)]"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 grid place-items-center border border-cyber-cyan/30 group-hover:from-cyber-cyan/30 group-hover:to-cyber-purple/30 transition">
                <f.icon className="h-5 w-5 text-cyber-cyan" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-base">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-16">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-cyber-cyan">How CipherNet Works</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight">From signal → verdict in <span className="text-cyber-cyan">milliseconds</span></h2>
        </div>
        <div className="mt-12 grid md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />
          {[
            { n: "01", t: "Ingest", d: "URLs, messages, voice, video, QR — multi-modal capture." },
            { n: "02", t: "Analyze", d: "Specialized AI models score risk across 240+ signals." },
            { n: "03", t: "Correlate", d: "Federated threat graph cross-checks the global network." },
            { n: "04", t: "Act", d: "Block, warn, or explain — with human-readable reasoning." },
          ].map((s, i) => (
            <motion.div key={s.n} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1 }} className="relative glass rounded-xl p-5 glow-border">
              <div className="h-10 w-10 rounded-full bg-background border border-cyber-cyan/40 grid place-items-center text-xs font-display font-semibold text-cyber-cyan">{s.n}</div>
              <div className="mt-4 font-display font-semibold">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl glass-strong glow-border p-10 md:p-16">
          <div className="absolute inset-0 cyber-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyber-purple/30 blur-[120px]" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Deploy your <span className="text-gradient-cyber">cyber defense OS</span> today</h2>
            <p className="mt-4 text-muted-foreground">Join the security teams using CipherNet AI to detect, explain, and stop the next generation of digital fraud.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/threat-intelligence" className="px-5 py-3 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background font-semibold shadow-[0_0_30px_oklch(0.78_0.18_220_/_0.45)]">
                Open Command Center
              </Link>
              <Link to="/trust-engine" className="px-5 py-3 rounded-md border border-border/60 hover:border-cyber-cyan/60 hover:text-cyber-cyan transition font-medium">
                Explore Trust Engine
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
