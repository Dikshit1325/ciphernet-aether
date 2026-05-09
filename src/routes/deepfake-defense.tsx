import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Brain, CheckCircle2, Loader2, Mic, Upload, Video, Waves } from "lucide-react";

import { PageShell, Panel, Stat } from "@/components/site/PageShell";
import { formatFilename, formatPercent } from "@/lib/media-analysis";
import { useMediaAnalysis } from "@/hooks/use-media-analysis";

export const Route = createFileRoute("/deepfake-defense")({
  head: () => ({
    meta: [
      { title: "Deepfake & Voice Defense — CipherNet AI" },
      { name: "description", content: "Frame-level deepfake detection, voice clone analysis and    AI authenticity verification." },
      { property: "og:title", content: "Deepfake & Voice Defense — CipherNet AI" },
      { property: "og:description", content: "Frame-level deepfake detection and voice clone analysis." },
    ],
  }),
  component: Page,
});

const bars = Array.from({ length: 64 }, (_, i) => 20 + Math.abs(Math.sin(i / 4)) * 60 + Math.random() * 25);

const loadingStages = [
  "Analyzing Media...",
  "Scanning GAN Artifacts...",
  "Detecting Voice Clone...",
  "Verifying Lip-Sync Drift...",
];

function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const { result, loading, error, runAnalysis } = useMediaAnalysis();

  useEffect(() => {
    if (!loading) {
      setLoadingStageIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingStageIndex((current) => (current + 1) % loadingStages.length);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [loading]);

  const analysisSummary = useMemo(() => {
    if (!result) {
      return null;
    }

    return [
      ["Voice Clone", formatPercent(result.clone_probability)],
      ["Video Synth", formatPercent(result.deepfake_score)],
      ["Lip-sync drift", result.lip_sync_drift],
      ["Provenance", result.gan_artifacts],
    ] as const;
  }, [result]);

  const handleFileSelection = (file: File | null) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleFileSelection(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile || loading) {
      return;
    }

    await runAnalysis(selectedFile);
  };

  return (
    <PageShell
      eyebrow="Multi-modal Authenticity"
      title={<>Deepfake & <span className="text-gradient-cyber">Voice Defense</span></>}
      subtitle="Detect AI-generated audio clones, manipulated video and synthetic media with frame-level analysis and lip-sync verification."
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Voice Scam Analyzer" action={<Mic className="h-4 w-4 text-cyber-cyan" />}>
          <div className="rounded-xl border border-border/60 bg-background/40 p-5 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Waves className="h-3 w-3 text-cyber-cyan" /> Streaming sample · 00:14
              </div>
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
                <Metric label="Authenticity" value={result ? formatPercent(result.authenticity) : "--"} tone={result && result.authenticity > 50 ? "good" : "bad"} />
                <Metric label="Clone Probability" value={result ? formatPercent(result.clone_probability) : "--"} tone="bad" />
                <Metric label="Emotional Intent" value={result?.emotional_intent ?? "Awaiting scan"} tone="bad" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="mt-4 rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-3 text-xs">
              <span className="text-cyber-red font-semibold">{result.verdict}</span> Spectral and timing analysis completed for {result.filename}.
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-border/50 bg-background/20 p-3 text-xs text-muted-foreground">
              Upload a media file to generate the dynamic voice profile.
            </div>
          )}
        </Panel>

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
            {[[40, 38], [60, 38], [50, 52], [42, 62], [58, 62]].map(([x, y], i) => (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_oklch(0.85_0.16_205)]"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span className={result ? "text-cyber-red" : "text-muted-foreground"}>{result ? `Synthetic · ${result.deepfake_score}%` : "Awaiting analysis"}</span>
              <span className="text-muted-foreground">{result ? result.filename : "No media loaded"}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <Metric label="Lip-sync" value={result?.lip_sync_drift ?? "--"} tone={result ? "bad" : "good"} />
            <Metric label="GAN Artifacts" value={result?.gan_artifacts ?? "--"} tone={result ? "bad" : "good"} />
            <Metric label="Authenticity" value={result ? formatPercent(result.authenticity) : "--"} tone={result && result.authenticity > 50 ? "good" : "bad"} />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Panel title="Upload Media">
          <div
            className={`aspect-video rounded-xl border-2 border-dashed grid place-items-center bg-background/30 transition-colors ${isDragging ? "border-cyber-cyan bg-cyber-cyan/5" : "border-border/60"}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="text-center px-5">
              <Upload className="h-8 w-8 mx-auto text-cyber-cyan" />
              <div className="mt-2 text-xs text-muted-foreground">Drop audio (.wav/.mp3) or video (.mp4)</div>
              <div className="mt-3 rounded-md border border-border/50 bg-background/40 px-3 py-2 text-xs text-foreground">
                {formatFilename(selectedFile)}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button onClick={handleBrowseClick} className="px-3 py-1.5 rounded-md border border-cyber-cyan/40 text-xs text-cyber-cyan">
                  Browse files
                </button>
                <button
                  onClick={handleAnalyzeClick}
                  disabled={!selectedFile || loading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-cyan text-background text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {loading ? "Analyzing..." : "Run analysis"}
                </button>
              </div>
              <input ref={fileInputRef} className="hidden" type="file" accept="audio/*,video/*" onChange={handleInputChange} />
            </div>
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="AI Authenticity Report" action={<Brain className="h-4 w-4 text-cyber-purple" />}>
          {loading && (
            <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 p-4 text-sm leading-relaxed animate-pulse">
              <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">{loadingStages[loadingStageIndex]}</div>
              <div className="mt-3 h-2 w-3/4 rounded-full bg-cyber-cyan/20" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-cyber-cyan/15" />
              <div className="mt-2 h-2 w-5/6 rounded-full bg-cyber-cyan/10" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-4 text-sm text-cyber-red flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && result && (
            <>
              <div className="rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4 text-sm leading-relaxed">
                <div className="text-[10px] uppercase tracking-widest text-cyber-purple">Multi-modal Verdict</div>
                <p className="mt-2">
                  {result.verdict}. The uploaded file <span className="text-cyber-cyan">{result.filename}</span> produced a deepfake score of <span className="text-cyber-red">{formatPercent(result.deepfake_score)}</span> with <span className="text-cyber-cyan">{result.lip_sync_drift}</span> lip-sync drift and <span className="text-cyber-cyan">{result.emotional_intent}</span> intent classification.
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {analysisSummary?.map(([label, value]) => (
                  <div key={label} className="rounded-md border border-border/50 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                    <div className="mt-1 font-display text-base text-cyber-cyan">{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && !result && (
            <div className="rounded-lg border border-border/50 bg-background/20 p-4 text-sm text-muted-foreground">
              Upload a media file and run analysis to populate the report with backend-driven results.
            </div>
          )}
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

function Metric({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) {
  const c = tone === "bad" ? "text-cyber-red" : "text-cyber-green";

  return (
    <div className="rounded-md border border-border/50 p-3 bg-background/30">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-base ${c}`}>{value}</div>
    </div>
  );
}
