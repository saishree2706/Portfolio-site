"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Wrench, Cloud } from "lucide-react";
import { SKILLS } from "@/data/site";
import { Accent, SectionHeading, reveal } from "./SectionHeading";

const ICONS = [Code2, Layers, Wrench, Cloud];

export default function Skills() {
  const categories = Object.entries(SKILLS);
  const all = categories.flatMap(([, items]) => items);

  return (
    <section id="skills" className="relative py-28 md:py-36 scroll-mt-16 bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <motion.div {...reveal} className="mb-14 md:mb-16 max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
            <span className="text-sky-400">02</span><span className="h-px w-8 bg-slate-700" />Toolkit
          </p>
          <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.02]">
            The stack I <span className="bg-gradient-to-r from-sky-300 to-indigo-400 bg-clip-text text-transparent">reach for.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(([category, items], ci) => {
            const Icon = ICONS[ci % ICONS.length];
            return (
              <motion.div
                key={category}
                {...reveal}
                transition={{ ...reveal.transition, delay: ci * 0.08 }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden"
              >
                {/* Cursor spotlight */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "radial-gradient(260px circle at var(--mx) var(--my), rgba(56,189,248,0.16), transparent 70%)" }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-sky-300 ring-1 ring-white/10">
                      <Icon size={19} />
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">0{ci + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300 hover:border-sky-400/50 hover:text-white transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Marquee of every skill */}
      <div className="relative mt-20 border-y border-white/10 py-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-10">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="flex items-center gap-10 text-3xl md:text-4xl font-semibold tracking-tight text-white/20 whitespace-nowrap">
              {s}<span className="text-sky-400/60 text-xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
