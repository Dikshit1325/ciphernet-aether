import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedScanResultProps {
  children: ReactNode;
  staggerDelay?: number;
}

/**
 * Wrapper for animated scan result cards with staggered animations
 */
export function AnimatedScanResult({
  children,
  staggerDelay = 0.1,
}: AnimatedScanResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated progress circle for trust scores
 */
interface AnimatedProgressCircleProps {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function AnimatedProgressCircle({
  value,
  color,
  size = 120,
  strokeWidth = 8,
}: AnimatedProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full -rotate-90"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="oklch(0.3 0.04 255)"
        strokeWidth={strokeWidth}
        fill="none"
      />

      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  );
}

/**
 * Animated progress bar with gradient
 */
interface AnimatedProgressBarProps {
  value: number;
  gradient: string;
  animated?: boolean;
}

export function AnimatedProgressBar({
  value,
  gradient,
  animated = true,
}: AnimatedProgressBarProps) {
  return (
    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${gradient}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

/**
 * Container for staggered child animations
 */
interface AnimatedContainerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
}

export function AnimatedContainer({
  children,
  stagger = 0.1,
  delay = 0,
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item for staggered animations
 */
interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedItem({ children, className = "" }: AnimatedItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glowing text animation for alerts
 */
interface GlowingTextProps {
  text: string;
  className?: string;
  intensity?: number;
}

export function GlowingText({
  text,
  className = "",
  intensity = 1,
}: GlowingTextProps) {
  return (
    <motion.span
      animate={{
        textShadow: [
          `0 0 ${5 * intensity}px rgba(239, 68, 68, 0), 0 0 ${10 * intensity}px rgba(239, 68, 68, 0)`,
          `0 0 ${10 * intensity}px rgba(239, 68, 68, 0.5), 0 0 ${20 * intensity}px rgba(239, 68, 68, 0.3)`,
          `0 0 ${5 * intensity}px rgba(239, 68, 68, 0), 0 0 ${10 * intensity}px rgba(239, 68, 68, 0)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
