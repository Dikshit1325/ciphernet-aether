import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { motion } from "framer-motion";
import { Mic, Video, Brain, Upload, Waves } from "lucide-react";

export const Route = createFileRoute("/deepfake-defense")({
  head: () => ({
    meta: [
      { title: "Deepfake & Voice Defense — CipherNet AI" },
      { name: "description", content: "Frame-level deepfake detection, voice clone analysis and AI authenticity verification." },
      { property: "og:title", content: "Deepfake & Voice Defense — CipherNet AI" },
      { property: "og:description", content: "Frame-level deepfake detection and voice clone analysis." },
    ],
  }),
  component: Page,
});

const bars = Array.from({ length: 64 }, (_, i) => 20 + Math.abs(Math.sin(i / 4)) * 60 + Math.random() * 25);

function Page() {
  return (
    <PageShell
      eyebrow="Multi-modal Authenticity"
      title={<>Deepfake & <span className="text-gradient-cyber">Voice Defense</span></>}
      subtitle="Detect AI-generated audio clones, manipulated video and synthetic media with frame-level analysis and lip-sync verification."
    >
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Voice analyzer */}
        <Panel title="Voice Scam Analyzer" action={<Mic className="h-4 w-4 text-cyber-cyan" />}>
          <div className="rounded-xl border border-border/60 bg-background/40 p-5 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Waves className="h-3 w-3 text-cyber-cyan" /> Streaming sample · 00:14</div>
              <div className="mt-4 flex items-end gap-[3px] h-28">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0.2 }}
                    animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.6, delay: (i % 8) * 0.05 }}
                    style={{ height: `${h}%`, transformOrigin: "bottom" }}
                    className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-sm"
                  />
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                <Metric label="Authenticity" value="11%" tone="bad" />
                <Metric label="Clone Probability" value="89%" tone="bad" />
                <Metric label="Emotional Intent" value="Coercion" tone="bad" />
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-3 text-xs">
            <span className="text-cyber-red font-semibold">AI-cloned voice detected.</span> Spectral artifacts at 8.4kHz consistent with neural vocoder synthesis.
          </div>
        </Panel>

        {/* Deepfake video */}
        <Panel title="Deepfake Media Scanner" action={<Video className="h-4 w-4 text-cyber-purple" />}>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-background/60">
            <div className="absolute inset-0 cyber-grid opacity-30" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative h-32 w-32 rounded-full border border-cyber-cyan/40 bg-cyber-cyan/5 grid place-items-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyber-cyan/30 to-cyber-purple/30" />
                <div className="absolute inset-0 rounded-full border border-cyber-cyan/30 animate-ping" />
              </div>
            </div>
            <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyber-cyan/30 to-transparent scan-line" />
            {/* face mesh markers */}
            {[[40,38],[60,38],[50,52],[42,62],[58,62]].map(([x,y], i) => (
              <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_oklch(0.85_0.16_205)]" style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span className="text-cyber-red">Synthetic · 96%</span>
              <span className="text-muted-foreground">frame 217 / 1240</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <Metric label="Lip-sync" value="Mismatch" tone="bad" />
            <Metric label="GAN Artifacts" value="High" tone="bad" />
            <Metric label="Authenticity" value="4%" tone="bad" />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel title="Upload Media">
          <div className="aspect-video rounded-xl border-2 border-dashed border-border/60 grid place-items-center bg-background/30">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto text-cyber-cyan" />
              <div className="mt-2 text-xs text-muted-foreground">Drop audio (.wav/.mp3) or video (.mp4)</div>
              <button className="mt-3 px-3 py-1.5 rounded-md border border-cyber-cyan/40 text-xs text-cyber-cyan">Browse files</button>
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="AI Authenticity Report" action={<Brain className="h-4 w-4 text-cyber-purple" />}>
          <div className="rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4 text-sm leading-relaxed">
            <div className="text-[10px] uppercase tracking-widest text-cyber-purple">Multi-modal Verdict</div>
            <p className="mt-2">
              The submitted media presents a <span className="text-cyber-red">high-confidence synthetic profile</span>. Voice spectrogram exhibits artifacts characteristic of neural vocoder cloning. Visual analysis flags GAN-style frequency residue around the mouth region with a measurable <span className="text-cyber-cyan">218ms lip-audio drift</span>. Combined verdict: deepfake (96%).
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {[["Voice Clone","89%"],["Video Synth","96%"],["Lip-sync drift","218ms"],["Provenance","Unknown"]].map(([k,v]) => (
              <div key={k} className="rounded-md border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="mt-1 font-display text-base text-cyber-cyan">{v}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Media Analyzed" value="2.1M" accent="cyan" />
        <Stat label="Deepfakes Caught" value="48,917" accent="purple" />
        <Stat label="Voice Clones" value="22,113" accent="red" />
        <Stat label="Detection Latency" value="180ms" accent="green" />
      </div>
    </PageShell>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "good"|"bad" }) {
  const c = tone === "bad" ? "text-cyber-red" : "text-cyber-green";
  return (
    <div className="rounded-md border border-border/50 p-3 bg-background/30">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-base ${c}`}>{value}</div>
    </div>
  );
}
