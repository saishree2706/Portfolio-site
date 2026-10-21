"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { EASE } from "./SectionHeader";
import { PASSION, PROFILE, TRAVEL_PHOTOS } from "@/data/site";

function RotatingBadge() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      className="w-32 h-32"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="var(--gold)" fontSize="13" fontFamily="var(--font-geist-mono), monospace">
          {/* Stretch to exactly the circumference (2π·78) so the loop closes cleanly */}
          <textPath href="#badge-circle" textLength="488" lengthAdjust="spacing">{PASSION.badgeText}</textPath>
        </text>
      </svg>
    </motion.div>
  );
}

function PortraitCard() {
  const [flipped, setFlipped] = useState(false);
  const arch = "polygon(0 22%, 3% 14%, 9% 7.5%, 18% 3%, 30% 0.6%, 50% 0, 70% 0.6%, 82% 3%, 91% 7.5%, 97% 14%, 100% 22%, 100% 100%, 0 100%)";

  return (
    <div
      className="relative cursor-pointer w-[min(78vw,340px)] aspect-[3/4]"
      style={{ perspective: "1400px" }}
      onClick={() => setFlipped((f) => !f)}
      title={flipped ? "Click to flip back" : "Click to flip"}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", clipPath: arch }}>
          <Image src={PROFILE.photo} alt={PROFILE.name} fill priority sizes="340px" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
            <p className="font-display italic text-3xl text-ivory">Hello.</p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ivory/60">↺ Tap</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-7 bg-ink-3"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", clipPath: arch }}
        >
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--gold) 35%, transparent), transparent 60%)" }} />
          <div className="relative space-y-5">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold">Available for</p>
            <ul className="space-y-2 font-display text-2xl text-ivory font-light">
              {PASSION.availableFor.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <a
              href="#creative-contact"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold tracking-wide text-ink hover:bg-ivory transition-colors"
            >
              Book a collab <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Gold arch outline offset behind the card */}
      <div
        className="absolute inset-0 -z-10 translate-x-4 translate-y-4 border border-gold/30"
        style={{ borderRadius: "50% 50% 0 0 / 22% 22% 0 0" }}
      />
    </div>
  );
}

export default function CreativeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      <section ref={ref} id="creative-hero" className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {/* Ambient light */}
        <div className="absolute -top-40 right-[-10%] w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--gold) 14%, transparent), transparent 65%)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(233,162,140,0.08), transparent 65%)" }} />

        <div className="relative flex-1 max-w-7xl w-full mx-auto px-6 md:px-10 pt-32 pb-16 grid lg:grid-cols-12 gap-14 items-center">
          {/* Text */}
          <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-ivory-faint"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {PROFILE.name} — Based in {PROFILE.location}
            </motion.div>

            <h1 className="font-display font-light text-ivory text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]">
              {PASSION.heroLines.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15 + li * 0.12, ease: EASE }}
                    className="block"
                  >
                    {line.map((w, wi) => (
                      <span key={wi} className={"accent" in w && w.accent ? "italic text-gilded pr-[0.05em]" : ""}>
                        {w.text}
                        {wi < line.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
              className="flex flex-col sm:flex-row sm:items-center gap-8"
            >
              <p className="text-[15px] leading-relaxed text-ivory-dim max-w-sm">
                {PASSION.heroIntro}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#youtube"
                  className="group inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3.5 text-sm font-semibold text-ink hover:bg-gold transition-colors"
                >
                  Watch travels
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#reels"
                  className="inline-flex items-center rounded-full border border-ivory/20 px-6 py-3.5 text-sm font-medium text-ivory hover:border-gold hover:text-gold transition-colors"
                >
                  Reels
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative">
              <PortraitCard />
              <div className="absolute -left-14 bottom-10 hidden md:flex items-center justify-center rounded-full bg-ink/70 backdrop-blur-md border border-line">
                <RotatingBadge />
                <span className="absolute font-display italic text-2xl text-ivory">✦</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.a
          href="#gallery"
          style={{ opacity: fade }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative mx-auto mb-8 flex flex-col items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ivory-faint hover:text-gold transition-colors"
        >
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-ivory/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gold"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <ArrowDown size={12} className="sr-only" />
        </motion.a>
      </section>

      <TravelMarquee />
    </>
  );
}

function TravelMarquee() {
  const places = PASSION.places;
  const photos = [...TRAVEL_PHOTOS, ...TRAVEL_PHOTOS];

  return (
    <section id="gallery" className="relative py-20 md:py-28 overflow-hidden border-y border-line">
      {/* Outline place names */}
      <div className="flex whitespace-nowrap animate-marquee-fast w-max mb-14" aria-hidden>
        {[...places, ...places].map((p, i) => (
          <span key={i} className="font-display italic font-light text-[clamp(3rem,9vw,8rem)] leading-none px-8 text-transparent"
            style={{ WebkitTextStroke: "1px color-mix(in srgb, var(--gold) 40%, transparent)" }}>
            {p} <span className="not-italic text-gold/50" style={{ WebkitTextStroke: 0 }}>✦</span>
          </span>
        ))}
      </div>

      {/* Photo ribbon */}
      <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
        {photos.map((src, i) => (
          <div
            key={i}
            className={`group relative shrink-0 overflow-hidden rounded-sm ${i % 2 ? "w-[300px] h-[380px] mt-12" : "w-[420px] h-[300px]"}`}
          >
            <Image
              src={src}
              alt="Travel moment"
              fill
              sizes="420px"
              className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-[1200ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.25em] uppercase text-ivory/70">
              No. {String((i % TRAVEL_PHOTOS.length) + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
