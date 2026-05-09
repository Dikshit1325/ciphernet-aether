import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

export type AnalysisStep = {
  label: string;
  completed?: boolean;
  current?: boolean;
};

/**
 * URL Analysis Pipeline Steps
 */
export const urlAnalysisSteps: AnalysisStep[] = [
  { label: "Inspecting domain..." },
  { label: "Checking SSL certificate..." },
  { label: "Scanning redirect chain..." },
  { label: "Detecting phishing patterns..." },
  { label: "Running trust analysis..." },
  { label: "Generating AI verdict..." },
];

/**
 * SMS Analysis Pipeline Steps
 */
export const smsAnalysisSteps: AnalysisStep[] = [
  { label: "Running NLP analysis..." },
  { label: "Detecting urgency manipulation..." },
  { label: "Checking authority spoofing..." },
  { label: "Identifying credential theft patterns..." },
  { label: "Analyzing job fraud signals..." },
  { label: "Generating scam probability..." },
];

interface CyberLoadingPipelineProps {
  steps: AnalysisStep[];
  currentStep?: number;
}

/**
 * Animated cyber loading pipeline with sequential step indicators
 */
export function CyberLoadingPipeline({
  steps,
  currentStep = 0,
}: CyberLoadingPipelineProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-cyber-cyan text-xs uppercase tracking-widest font-semibold">
        <Zap className="h-3.5 w-3.5 animate-pulse" />
        AI Threat Engine Active
      </div>

      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
              }}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                isCompleted
                  ? "border-cyber-green/40 bg-cyber-green/5"
                  : isCurrent
                    ? "border-cyber-cyan/60 bg-cyber-cyan/10 shadow-lg shadow-cyber-cyan/20"
                    : "border-border/40 bg-background/20"
              }`}
            >
              <motion.div
                animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-cyber-green" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 rounded-full border-2 border-transparent border-t-cyber-cyan border-r-cyber-cyan animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border/60" />
                )}
              </motion.div>

              <motion.span
                className={`text-sm font-medium transition-colors ${
                  isCompleted
                    ? "text-cyber-green"
                    : isCurrent
                      ? "text-cyber-cyan"
                      : "text-muted-foreground"
                }`}
                animate={isCurrent ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {step.label}
              </motion.span>

              {isCompleted && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto text-[10px] uppercase tracking-widest text-cyber-green font-semibold"
                >
                  Verified
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <motion.div className="mt-4 h-1 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Compact loading state indicator
 */
export function MiniLoadingIndicator({ text = "Analyzing..." }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-cyber-cyan"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span className="text-cyber-cyan text-sm font-medium">{text}</span>
    </motion.div>
  );
}
