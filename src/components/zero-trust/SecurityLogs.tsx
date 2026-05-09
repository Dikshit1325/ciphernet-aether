import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  level: "info" | "warn" | "error" | "success";
}

interface SecurityLogsProps {
  logs: LogEntry[];
}

export function SecurityLogs({ logs }: SecurityLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getColor = (level: string) => {
    switch (level) {
      case "error": return "text-destructive";
      case "warn": return "text-warning";
      case "success": return "text-emerald-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="glass-panel p-6 border border-border/50 h-[300px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/30">
        <Terminal className="h-4 w-4 text-cyber-purple" />
        <h3 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider">Live Security Logs</h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 pr-2 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-muted-foreground/60 whitespace-nowrap shrink-0">[{log.timestamp}]</span>
              <span className={`${getColor(log.level)} font-medium shrink-0`}>
                {log.level.toUpperCase().padEnd(7)}
              </span>
              <span className="text-foreground/80 break-words">{log.action}</span>
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="text-muted-foreground/50 italic">Waiting for telemetry...</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
