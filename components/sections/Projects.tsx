"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { PROJECTS, SOCIALS, type Project } from "@/data/site";
import { Accent, SectionHeading, reveal } from "./SectionHeading";

function Links({ p, light }: { p: Project; light?: boolean }) {
  const cls = light ? "text-white/70 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-foreground hover:bg-slate-100";
  return (
    <div className="flex gap-1">
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub`} className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors ${cls}`}>
          <GithubIcon size={18} />
        </a>
      )}
      {p.demo && (
        <a href={p.demo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} live demo`} className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors ${cls}`}>
          <ExternalLink size={17} />
        </a>
      )}
    </div>
  );
}

function FeaturedCard({ p }: { p: Project }) {
  return (
    <motion.article {...reveal} className="relative lg:col-span-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 md:p-12 text-white shadow-[0_40px_100px_-40px_rgba(79,70,229,0.7)]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur">★ Featured</span>
            <Links p={p} light />
          </div>
          <h3 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em]">{p.title}</h3>
          <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-xl">{p.description}</p>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20">{t}</span>)}
          </div>
        </div>

        {p.flow && (
          <div className="md:col-span-2 space-y-3">
            {p.flow.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="relative"
              >
                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-700 font-mono text-xs font-bold">0{i + 1}</span>
                  <span className="font-medium">{step}</span>
                </div>
                {i < p.flow!.length - 1 && <div className="ml-[2.1rem] h-3 w-px bg-white/30" />}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function ProjectCard({ p, idx }: { p: Project; idx: number }) {
  return (
    <motion.article
      {...reveal}
      transition={{ ...reveal.transition, delay: idx * 0.08 }}
      className="group relative flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.3)] hover:border-slate-300 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-10">
        <span className="font-mono text-sm text-slate-400">/0{idx + 2}</span>
        <Links p={p} />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-3">{p.title}</h3>
      <p className="text-sm leading-relaxed text-secondary flex-1">{p.description}</p>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {p.tech.map((t) => <span key={t} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">{t}</span>)}
        </div>
        <ArrowUpRight className="shrink-0 text-slate-300 group-hover:text-blue-600 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-28 md:py-36 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading index="03" label="Selected work" title={<>Things I&apos;ve <Accent>built.</Accent></>} />
          <motion.a {...reveal} href={SOCIALS.github} target="_blank" rel="noopener noreferrer"
            className="mb-14 md:mb-16 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-blue-600 transition-colors shrink-0">
            <GithubIcon size={16} /> All repositories <ArrowUpRight size={15} />
          </motion.a>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {featured && <FeaturedCard p={featured} />}
          {rest.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
