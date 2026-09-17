import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-[540px] px-6 py-16 sm:px-10 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ text }: { text: string }) {
  return (
    <Reveal className="mb-7 text-center">
      <p className="font-script text-ink text-[2rem] leading-tight sm:text-[2.4rem]">{text}</p>
      <div className="ink-rule mx-auto mt-2 w-24" />
    </Reveal>
  );
}
