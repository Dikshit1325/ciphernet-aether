import { motion } from "framer-motion";
import { Shield, Lock, Eye, Sparkles } from "lucide-react";

export function AuthBackdrop({
  title,
  subtitle,
  metricLabel,
  metricValue,
}: {
  title: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/40 p-6 md:p-8">
      <div className="absolute inset-0 cyber-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] pointer-events-none" />
      <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-cyber-cyan/10 blur-3xl" />
      <div className="absolute -bottom-8 left-0 h-44 w-44 rounded-full bg-cyber-purple/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
          <Sparkles className="h-3 w-3" />
          Secure access gateway
        </div>

        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: Shield,
              label: "Threat intelligence",
              value: "Live",
            },
            {
              icon: Lock,
              label: "Session protection",
              value: "Enabled",
            },
            {
              icon: Eye,
              label: metricLabel,
              value: metricValue,
            },
            {
              icon: Sparkles,
              label: "AI trust engine",
              value: "Active",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-2xl border border-border/50 bg-background/50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/10">
                      <Icon className="h-4 w-4 text-cyber-cyan" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="mt-1 font-display text-lg font-semibold text-foreground">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>SOC monitoring</span>
            <span className="text-cyber-green">Online</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              "AI Engine Active",
              "Threat Intelligence Online",
              "Live Monitoring Enabled",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"
              >
                <span className="text-sm text-foreground/90">{item}</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-cyber-green"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
