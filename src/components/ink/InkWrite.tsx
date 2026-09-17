import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

interface InkWriteProps {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  duration?: number;
  letterSpacing?: number;
  className?: string;
  /** show the travelling nib dot while the stroke is laid down */
  nib?: boolean;
  play?: boolean;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Genuine ink formation: an animated calligraphic stroke travels across the
 * word and is used as the reveal mask, so the lettering exists only where the
 * ink has physically passed. Not a text fade.
 */
export function InkWrite({
  text,
  fontFamily = "var(--font-script)",
  fontSize = 92,
  color = "var(--ink)",
  delay = 0,
  duration = 2.2,
  letterSpacing = 0,
  className,
  nib = true,
  play = true,
}: InkWriteProps) {
  const rawId = useId();
  const maskId = `ink-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const measureRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    let frame = requestAnimationFrame(() => {
      try {
        const b = el.getBBox();
        if (!b.width) {
          frame = requestAnimationFrame(() => {
            const b2 = el.getBBox();
            setBox({
              x: b2.x - fontSize * 0.18,
              y: b2.y - fontSize * 0.3,
              w: b2.width + fontSize * 0.36,
              h: b2.height + fontSize * 0.6,
            });
          });
          return;
        }
        setBox({
          x: b.x - fontSize * 0.18,
          y: b.y - fontSize * 0.3,
          w: b.width + fontSize * 0.36,
          h: b.height + fontSize * 0.6,
        });
      } catch {
        /* measurement unavailable */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [text, fontSize, fontFamily, letterSpacing]);

  const textProps = {
    x: 0,
    y: 0,
    textAnchor: "middle" as const,
    fontFamily,
    fontSize,
    letterSpacing,
    style: { whiteSpace: "pre" as const },
  };

  if (!box) {
    return (
      <svg
        className={className}
        width="100%"
        viewBox={`-200 -${fontSize} 400 ${fontSize * 2}`}
        aria-hidden
        focusable="false"
      >
        <text {...textProps} ref={measureRef} fill="transparent">
          {text}
        </text>
      </svg>
    );
  }

  const midY = box.y + box.h / 2;
  const amp = box.h * 0.1;
  const d = `M ${box.x - box.h * 0.2} ${midY + amp} C ${box.x + box.w * 0.28} ${midY - amp * 1.6}, ${
    box.x + box.w * 0.62
  } ${midY + amp * 1.8}, ${box.x + box.w + box.h * 0.2} ${midY - amp * 0.6}`;

  const instant = reduced || !play;

  return (
    <svg
      className={className}
      width="100%"
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <motion.path
            d={d}
            stroke="white"
            strokeWidth={box.h * 1.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: instant ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: instant ? 0 : duration, delay: instant ? 0 : delay, ease: [0.5, 0, 0.3, 1] }}
          />
        </mask>
      </defs>
      <text {...textProps} ref={measureRef} fill={color} mask={`url(#${maskId})`}>
        {text}
      </text>
      {nib && !instant && (
        <motion.circle
          r={box.h * 0.035}
          fill="var(--ink)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration, delay, ease: [0.5, 0, 0.3, 1] }}
          style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
        />
      )}
    </svg>
  );
}
