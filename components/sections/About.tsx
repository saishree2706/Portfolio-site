"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Palette, Heart } from "lucide-react";
import { PROFESSION, PROFILE, TRAVEL_PHOTOS } from "@/data/site";
import { Accent, EASE, SectionHeading, reveal } from "./SectionHeading";

const FACT_ICONS = [MapPin, Briefcase, Palette, Heart];

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading index="01" label="About" title={<>Engineer by craft, <Accent>storyteller</Accent> by nature.</>} />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Photo stack */}
          <motion.div {...reveal} className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-slate-200 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
              <Image src={PROFILE.photo} alt={PROFILE.name} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[50%_70%]" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="absolute -right-4 md:-right-10 -bottom-10 w-40 md:w-52 aspect-[3/4] overflow-hidden rounded-2xl border-[6px] border-white shadow-2xl"
            >
              <Image src={TRAVEL_PHOTOS[1]} alt="Travel" fill sizes="220px" className="object-cover" />
            </motion.div>
            <div className="absolute -left-4 top-8 rounded-full bg-white/90 backdrop-blur px-4 py-2 font-mono text-[11px] text-slate-600 shadow-lg ring-1 ring-slate-200">
              📍 {PROFILE.location}
            </div>
          </motion.div>

          {/* Bio */}
          <div className="lg:col-span-7 lg:pl-6 space-y-10 pt-6 lg:pt-0">
            <motion.div {...reveal} className="space-y-5">
              <p className="text-2xl md:text-[1.7rem] leading-snug font-medium tracking-tight text-foreground">
                {PROFESSION.about[0]}
              </p>
              {PROFESSION.about.slice(1).map((p) => (
                <p key={p.slice(0, 20)} className="text-base leading-relaxed text-secondary">{p}</p>
              ))}
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-3">
              {PROFESSION.facts.map(({ label, value }, i) => {
                const Icon = FACT_ICONS[i % FACT_ICONS.length];
                return (
                  <motion.div
                    key={label}
                    {...reveal}
                    transition={{ ...reveal.transition, delay: i * 0.06 }}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon size={17} />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
