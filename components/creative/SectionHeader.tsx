"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-12 gap-8 items-end mb-14 md:mb-20">
      <div className="md:col-span-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4 mb-6 font-mono text-[11px] tracking-[0.25em] uppercase text-ivory-faint"
        >
          <span className="text-gold">{index}</span>
          <span className="h-px w-10 bg-gold/40" />
          <span>{eyebrow}</span>
        </motion.div>
        {/* Observe the clipping wrapper: the hidden h2 itself never intersects */}
        <motion.div
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: "-80px" }}
          className="overflow-hidden pb-2"
        >
          <motion.h2
            variants={{ hidden: { y: "105%" }, shown: { y: 0 } }}
            transition={{ duration: 1, ease: EASE }}
            className="font-display text-[clamp(2.6rem,6vw,5.25rem)] leading-[0.98] font-light text-ivory"
          >
            {title}
          </motion.h2>
        </motion.div>
      </div>
      {(description || aside) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="md:col-span-4 space-y-6"
        >
          {description && <p className="text-sm leading-relaxed text-ivory-dim max-w-sm">{description}</p>}
          {aside}
        </motion.div>
      )}
    </div>
  );
}
