"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { InstagramMedia, ReelsApiResponse } from "@/app/api/instagram/route";
import type { YouTubeApiResponse, YouTubeVideo } from "@/app/api/youtube/route";
import { EASE, SectionHeader } from "./SectionHeader";
import { shortTitle } from "./YouTubeSection";
import SwipeDeck from "./SwipeDeck";
import { PASSION, REELS_FALLBACK, SOCIALS, TRAVEL_PHOTOS } from "@/data/site";

const INSTAGRAM_URL = SOCIALS.instagram;
const FALLBACK_PHOTOS = TRAVEL_PHOTOS;

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n > 0 ? n.toString() : "—";
}

type Platform = "instagram" | "youtube";
type Reel = { id: string; href: string; thumb?: string; caption: string; views: number; date?: string; platform: Platform };

const placeholderReels: Reel[] = REELS_FALLBACK.map((r, i) => ({ id: `p${i}`, href: r.href, thumb: r.thumb, caption: r.caption, views: 0, platform: "instagram" as const }));
const PLACEHOLDERS: Record<Tab, Reel[]> = { top: placeholderReels, latest: [...placeholderReels].reverse(), shorts: [] };

type Tab = "top" | "latest" | "shorts";

const TAB_LABELS: Record<Tab, string> = { top: "Most viewed", latest: "Latest", shorts: "YouTube Shorts" };

function toReel(m: InstagramMedia): Reel {
  return {
    id: m.id,
    href: m.permalink,
    thumb: m.thumbnail_url ?? (m.media_url || undefined),
    caption: m.caption?.split("\n")[0].slice(0, 70) ?? "Reel",
    views: m.video_views,
    date: new Date(m.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    platform: "instagram",
  };
}

function shortToReel(v: YouTubeVideo): Reel {
  return {
    id: v.videoId,
    href: `https://www.youtube.com/shorts/${v.videoId}`,
    // Shorts thumbnails are 16:9 frames of a vertical video; object-cover crops to the subject
    thumb: `https://i.ytimg.com/vi/${v.videoId}/hq720.jpg`,
    caption: shortTitle(v.title),
    views: v.views,
    date: new Date(v.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    platform: "youtube",
  };
}

function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ReelCard({ reel, idx }: { reel: Reel; idx: number }) {
  return (
    <motion.a
      href={reel.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, delay: idx * 0.08, ease: EASE }}
      className={`group block ${idx % 2 === 1 ? "md:translate-y-16" : ""}`}
    >
      <ReelVisual reel={reel} idx={idx} />
    </motion.a>
  );
}

function ReelVisual({ reel, idx, className }: { reel: Reel; idx: number; className?: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`group relative aspect-[9/16] overflow-hidden rounded-[22px] bg-ink-3 ring-1 ring-line ${className ?? ""}`}>
      {/* Instagram CDN links are signed and expire; fall back to a local photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={!reel.thumb || broken ? FALLBACK_PHOTOS[idx % FALLBACK_PHOTOS.length] : reel.thumb}
        alt={reel.caption}
        loading="lazy"
        draggable={false}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1400ms] ease-out ${broken ? "grayscale-[40%] brightness-75" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-ink/30" />

      <div className="absolute top-4 inset-x-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-ivory/70">
        {reel.platform === "youtube" ? (
          <span className="flex items-center gap-1.5"><YoutubeIcon size={12} /> Short</span>
        ) : (
          <span className="flex items-center gap-1.5"><InstagramIcon size={12} /> Reel</span>
        )}
        {reel.date && <span>{reel.date}</span>}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5 space-y-3">
        {reel.views > 0 && (
          <p className="font-display text-3xl font-light text-ivory">
            {formatViews(reel.views)} <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/50 align-middle">views</span>
          </p>
        )}
        <div className="flex items-end justify-between gap-3">
          <p className="text-[13px] leading-snug text-ivory/85 line-clamp-2">{reel.caption}</p>
          <ArrowUpRight size={16} className="shrink-0 text-ivory/40 group-hover:text-gold transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default function ReelsSection() {
  const [data, setData] = useState<ReelsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [yt, setYt] = useState<YouTubeApiResponse | null>(null);
  const [tab, setTab] = useState<Tab>("top");

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((d: ReelsApiResponse) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d: YouTubeApiResponse) => setYt(d))
      .catch(() => setYt(null));
  }, []);

  const shorts = (yt?.shorts ?? []).slice(0, 4).map(shortToReel);
  const tabs: Tab[] = shorts.length > 0 ? ["top", "latest", "shorts"] : ["top", "latest"];

  const apiActive = !!(data?.configured && (data.topByViews.length > 0 || data.latestByDate.length > 0));
  const reels: Reel[] =
    tab === "shorts"
      ? shorts
      : apiActive
        ? (tab === "top" ? data!.topByViews : data!.latestByDate).slice(0, 4).map(toReel)
        : PLACEHOLDERS[tab];

  const stats = [
    { value: loading ? "—" : apiActive && data!.totalViews > 0 ? formatViews(data!.totalViews) : PASSION.reelStatsFallback.views, suffix: "+", label: "Total views" },
    { value: loading ? "—" : apiActive && data!.videoCount > 0 ? String(data!.videoCount) : PASSION.reelStatsFallback.count, suffix: "+", label: "Reels published" },
  ];

  return (
    <section id="reels" className="relative py-28 md:py-40 scroll-mt-16 bg-ink-2 border-y border-line overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(233,162,140,0.08), transparent 65%)" }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          index="02"
          eyebrow="Short-form · Instagram & YouTube"
          title={<>Moments, in <span className="italic text-gilded">ninety seconds</span></>}
          aside={
            <div className="flex gap-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-5xl font-light text-ivory tabular-nums">
                    {s.value}<span className="text-gold">{s.suffix}</span>
                  </p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-ivory-faint">{s.label}</p>
                </div>
              ))}
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="inline-flex rounded-full border border-line p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-5 py-2 text-xs font-medium tracking-wide rounded-full transition-colors"
                style={{ color: tab === t ? "var(--ink)" : "var(--ivory-dim)" }}
              >
                {tab === t && (
                  <motion.span layoutId="reel-tab" className="absolute inset-0 rounded-full bg-ivory" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <span className="relative">{TAB_LABELS[t]}</span>
              </button>
            ))}
          </div>
          {tab === "shorts" ? (
            <a href={`${SOCIALS.youtube}/shorts`} target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-ivory-dim hover:text-gold transition-colors">
              <YoutubeIcon /> <span className="link-underline">All Shorts on YouTube</span>
            </a>
          ) : (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-ivory-dim hover:text-gold transition-colors">
              <InstagramIcon /> <span className="link-underline">Follow on Instagram</span>
            </a>
          )}
        </div>

        {/* Mobile: swipeable card stack */}
        <div className="md:hidden">
          {loading ? (
            <div className="mx-auto w-[min(72vw,300px)] aspect-[9/16] rounded-[22px] bg-ivory/[0.04] animate-pulse" />
          ) : (
            <SwipeDeck
              key={tab}
              items={reels}
              getHref={(r) => r.href}
              getLabel={(r) => r.caption}
              renderCard={(r) => <ReelVisual reel={r} idx={reels.indexOf(r)} className="h-full shadow-2xl shadow-black/40" />}
              className="mx-auto w-[min(72vw,300px)] aspect-[9/16]"
            />
          )}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-6 pb-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`aspect-[9/16] rounded-[22px] bg-ivory/[0.04] animate-pulse ${i % 2 ? "md:translate-y-16" : ""}`} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {reels.map((r, i) => <ReelCard key={`${tab}-${r.id}`} reel={r} idx={i} />)}
            </AnimatePresence>
          )}
        </div>

        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
          className="sm:hidden mt-10 flex items-center justify-center gap-2 text-sm text-ivory-dim">
          <InstagramIcon /> Follow on Instagram
        </a>
      </div>
    </section>
  );
}
