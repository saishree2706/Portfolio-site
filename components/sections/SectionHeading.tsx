"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE },
};

export function SectionHeading({
  index,
  label,
  title,
  description,
  center,
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <motion.div {...reveal} className={`mb-14 md:mb-16 ${center ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}`}>
      <p className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500 ${center ? "justify-center" : ""}`}>
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-slate-300" />
        {label}
      </p>
      <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.02] text-foreground">
        {title}
      </h2>
      {description && <p className="mt-5 text-base md:text-lg leading-relaxed text-secondary">{description}</p>}
    </motion.div>
  );
}

/** Gradient-highlighted word used inside headings */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">{children}</span>;
}
