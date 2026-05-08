import { ReactNode } from "react";

export function PageShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: ReactNode; subtitle: string; children: ReactNode }) {
  return (
    <main className="relative">
      <div className="absolute inset-0 cyber-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] pointer-events-none" />
      <section className="relative mx-auto max-w-[1400px] px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cyber-cyan border border-cyber-cyan/30 rounded-full px-3 py-1 bg-cyber-cyan/5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan pulse-dot text-cyber-cyan" />
          {eyebrow}
        </div>
        <h1 className="mt-6 font-display text-4xl md:text-6xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-base md:text-lg">{subtitle}</p>
      </section>
      <section className="relative mx-auto max-w-[1400px] px-6 pb-24">{children}</section>
    </main>
  );
}

export function Stat({ label, value, accent = "cyan", sub }: { label: string; value: string; accent?: "cyan"|"purple"|"red"|"green"; sub?: string }) {
  const colors: Record<string,string> = {
    cyan: "text-cyber-cyan",
    purple: "text-cyber-purple",
    red: "text-cyber-red",
    green: "text-cyber-green",
  };
  return (
    <div className="glass rounded-xl p-5 glow-border">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl font-semibold ${colors[accent]}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className="" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 glow-border ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && <h3 className="font-display text-sm uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
