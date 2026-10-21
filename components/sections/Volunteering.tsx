"use client";

import { motion } from "framer-motion";
import { volunteering } from "@/data/volunteering";

export default function Volunteering() {
  return (
    <section id="volunteering" className="py-24 bg-background-alt">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-accent font-mono text-[11px] uppercase tracking-[0.25em]">
            04 — Volunteering
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-3">
            Giving Back
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-secondary mb-14 max-w-xl"
        >
          Code is a superpower — I try to use it to make a difference beyond
          the day job.
        </motion.p>

        {/* Timeline */}
        <div className="space-y-8">
          {volunteering.map((entry, idx) => (
            <motion.div
              key={entry.org}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-5"
            >
              {/* Timeline connector */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <div className="w-3 h-3 rounded-full bg-accent shadow-sm shadow-accent/30 shrink-0" />
                {idx < volunteering.length - 1 && (
                  <div className="w-px flex-1 bg-border min-h-[60px]" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow mb-2">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-foreground font-bold text-base">
                      {entry.org}
                    </h3>
                    <p className="text-accent font-medium text-sm mt-0.5">
                      {entry.role}
                    </p>
                  </div>
                  <span className="text-muted text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-full border border-border shrink-0">
                    {entry.period}
                  </span>
                </div>

                <p className="text-secondary text-sm leading-relaxed mb-4">
                  {entry.description}
                </p>

                <ul className="space-y-1.5 mb-4">
                  {entry.impact.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-secondary"
                    >
                      <span className="text-accent mt-0.5 shrink-0 font-bold">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {entry.cause.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-warm/10 text-amber-700 border border-warm/25 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
