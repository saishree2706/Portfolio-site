"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bike, Globe } from "lucide-react";
import { PROFESSION } from "@/data/site";
import { Accent, SectionHeading, reveal } from "./SectionHeading";

export default function Interests() {
  const { biking, travel } = PROFESSION.interests;

  return (
    <section id="interests" className="relative py-28 md:py-36 scroll-mt-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading index="04" label="Beyond code" title={<>Life off the <Accent>keyboard.</Accent></>} />

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Travel — large photo card */}
          <motion.div {...reveal} className="lg:col-span-7 relative overflow-hidden rounded-[2rem] min-h-[460px] group">
            <div className="absolute inset-0 grid grid-cols-3 gap-1">
              {travel.photos.map((src) => (
                <div key={src} className="relative overflow-hidden">
                  <Image src={src} alt="Travel moment" fill sizes="(min-width:1024px) 20vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8 md:p-10 text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20 mb-5">
                <Globe size={19} />
              </span>
              <h3 className="text-3xl font-semibold tracking-tight">{travel.title}</h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 mt-1">{travel.tagline}</p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">{travel.text}</p>
            </div>
          </motion.div>

          {/* Biking — stats card */}
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="lg:col-span-5 flex flex-col rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white mb-5">
              <Bike size={19} />
            </span>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground">{biking.title}</h3>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 mt-1">{biking.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-secondary">{biking.text}</p>

            <div className="mt-auto pt-10 grid grid-cols-3 gap-3">
              {biking.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-xl font-semibold tracking-tight text-foreground">{s.value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
