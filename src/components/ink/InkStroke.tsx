import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface InkStrokeProps {
  /** SVG path data drawn inside the given viewBox */
  d: string;
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  color?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  children?: ReactNode;
}

/** A single pen gesture that draws itself when scrolled into view. */
export function InkStroke({
  d,
  viewBox,
  className,
  strokeWidth = 1.4,
  color = "var(--gold-deep)",
  delay = 0,
  duration = 1.6,
  once = true,
  children,
}: InkStrokeProps) {
  const reduced = useReducedMotion();
  return (
    <svg className={className} viewBox={viewBox} fill="none" aria-hidden focusable="false">
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once, amount: 0.5 }}
        transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: "easeInOut" }}
      />
      {children}
    </svg>
  );
}

/** Small centred flourish used between sections. */
export function InkDivider({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <InkStroke
      className={`mx-auto h-6 w-40 ${className}`}
      viewBox="0 0 200 30"
      d="M4 15 C 40 15, 55 4, 76 12 C 88 16, 92 22, 100 22 C 108 22, 112 16, 124 12 C 145 4, 160 15, 196 15"
      delay={delay}
      strokeWidth={1.1}
    />
  );
}

/** A branching botanical gesture that grows out of the writing. */
export function InkVine({
  className = "",
  flip = false,
  delay = 0,
}: {
  className?: string;
  flip?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const leaves = [
    "M60 118 C 74 108, 84 112, 88 122 C 78 130, 66 128, 60 118 Z",
    "M56 86 C 42 76, 32 80, 28 90 C 38 98, 50 96, 56 86 Z",
    "M52 54 C 66 44, 76 48, 80 58 C 70 66, 58 64, 52 54 Z",
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 110 170"
      fill="none"
      aria-hidden
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <motion.path
        d="M56 168 C 56 140, 46 128, 52 100 C 58 74, 44 60, 54 26 C 57 16, 55 10, 52 4"
        stroke="var(--gold-deep)"
        strokeWidth={1.2}
        strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduced ? 0 : 2, delay, ease: "easeInOut" }}
      />
      {leaves.map((leaf, i) => (
        <motion.path
          key={leaf}
          d={leaf}
          fill="var(--gold)"
          fillOpacity={0.35}
          stroke="var(--gold-deep)"
          strokeWidth={0.8}
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduced ? 0 : 0.7, delay: delay + 0.5 + i * 0.35 }}
          style={{ transformOrigin: "56px 120px" }}
        />
      ))}
    </svg>
  );
}
