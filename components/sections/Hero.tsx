"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { PROFESSION, PROFILE, SOCIALS } from "@/data/site";
import { EASE } from "./SectionHeading";

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PROFESSION.roles.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={PROFESSION.roles[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap"
        >
          {PROFESSION.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const CODE_LINES: { indent?: number; parts: { t: string; c?: string }[] }[] = [
  { parts: [{ t: "const ", c: "text-pink-400" }, { t: "engineer", c: "text-sky-300" }, { t: " = {" }] },
  { indent: 1, parts: [{ t: "name: " }, { t: `"${PROFILE.name}"`, c: "text-emerald-300" }, { t: "," }] },
  { indent: 1, parts: [{ t: "based: " }, { t: `"${PROFILE.location}"`, c: "text-emerald-300" }, { t: "," }] },
  { indent: 1, parts: [{ t: "stack: " }, { t: "[" }, { t: PROFESSION.techBadges.slice(0, 3).map((b) => `"${b}"`).join(", "), c: "text-emerald-300" }, { t: "]," }] },
  { indent: 1, parts: [{ t: "offline: " }, { t: '"mountains"', c: "text-emerald-300" }, { t: "," }] },
  { indent: 1, parts: [{ t: "available: " }, { t: String(PROFILE.available), c: "text-amber-300" }] },
  { parts: [{ t: "};" }] },
];

function TerminalCard() {
  return (
    <div className="relative rounded-2xl bg-slate-950 shadow-[0_40px_100px_-30px_rgba(30,64,175,0.55)] ring-1 ring-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b border-white/10">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-slate-500">~/saishree/profile.ts</span>
      </div>
      <pre className="p-6 font-mono text-[13px] leading-7 text-slate-300 overflow-x-auto">
        {CODE_LINES.map((line, li) => (
          <motion.div
            key={li}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + li * 0.09, duration: 0.4 }}
            className="flex"
          >
            <span className="w-7 shrink-0 select-none text-slate-600">{li + 1}</span>
            <span style={{ paddingLeft: (line.indent ?? 0) * 18 }}>
              {line.parts.map((p, pi) => <span key={pi} className={p.c}>{p.t}</span>)}
            </span>
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="ml-7 inline-block h-4 w-2 translate-y-0.5 bg-sky-400"
        />
      </pre>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Grid + glow */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage: "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full bg-sky-300/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[520px] w-[520px] rounded-full bg-indigo-300/25 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-20 grid lg:grid-cols-12 gap-14 items-center">
        <motion.div style={{ y: textY }} className="lg:col-span-7 space-y-8">
          {PROFILE.available && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for opportunities
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="text-[clamp(2.6rem,5.6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground"
          >
            Hi, I&apos;m {PROFILE.name.split(" ")[0]}.
            <br />
            <span className="text-slate-400">I build</span>
            <br />
            <RotatingRole />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="max-w-xl text-lg leading-relaxed text-secondary"
          >
            {PROFESSION.pitch}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10">
              View my work <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href={PROFILE.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur hover:border-foreground transition-colors">
              <Download size={15} /> Download CV
            </a>
            <div className="flex items-center gap-1 pl-2">
              {[{ href: SOCIALS.github, Icon: GithubIcon, label: "GitHub" }, { href: SOCIALS.linkedin, Icon: LinkedinIcon, label: "LinkedIn" }].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="h-11 w-11 flex items-center justify-center rounded-full text-slate-500 hover:text-foreground hover:bg-white transition-colors">
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 max-w-lg divide-x divide-slate-200 border-y border-slate-200 pt-1"
          >
            {PROFESSION.stats.map((s) => (
              <div key={s.label} className="py-4 px-4 first:pl-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{s.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
          className="lg:col-span-5 relative"
        >
          <TerminalCard />
          {/* Floating chips */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 right-8 rounded-xl bg-white px-4 py-3 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Shipping</p>
            <p className="text-sm font-semibold text-foreground">Reel2Short ↗</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-4 flex gap-1.5 rounded-xl bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200"
          >
            {PROFESSION.techBadges.map((b) => (
              <span key={b} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-600">{b}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
