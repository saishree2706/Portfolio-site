"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { YouTubeApiResponse } from "@/app/api/youtube/route";
import { SOCIALS, TRAVEL_PHOTOS, PROFILE, YOUTUBE_VIDEOS } from "@/data/site";
import { EASE, SectionHeader } from "./SectionHeader";
import SwipeDeck from "./SwipeDeck";

const CHANNEL_URL = SOCIALS.youtube;
const FALLBACK_PHOTOS = [...TRAVEL_PHOTOS, PROFILE.photo];

type Card = { key: string; href: string; thumb: string; title: string; fullTitle?: string; meta: string; views?: number };

/** YouTube titles are often "Hook | keywords | keywords" — keep the hook for display. */
export function shortTitle(t: string) {
  return t.split("|")[0].trim();
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

function PlayDisc({ big }: { big?: boolean }) {
  return (
    <div className={`flex items-center justify-center rounded-full border border-ivory/30 bg-ink/30 backdrop-blur-md transition-all duration-500 group-hover:bg-gold group-hover:border-gold ${big ? "w-20 h-20" : "w-12 h-12"}`}>
      <svg width={big ? 22 : 14} height={big ? 22 : 14} viewBox="0 0 24 24" className="ml-1 fill-ivory group-hover:fill-ink transition-colors">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </div>
  );
}

function VideoCard({ card, idx, featured }: { card: Card; idx: number; featured?: boolean }) {
  return (
    <motion.a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (idx % 3) * 0.08, ease: EASE }}
      title={card.fullTitle}
      className={`group flex flex-col ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      {/* Thumbnails carry their own artwork, so keep text off them and use 16:9 like YouTube */}
      <div className={`relative overflow-hidden rounded-md bg-ink-3 ring-1 ring-line aspect-video ${featured ? "md:aspect-auto md:flex-1" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.thumb}
          alt={card.title}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.includes("maxresdefault")) img.src = img.src.replace("maxresdefault", "hqdefault");
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1400ms] ease-out"
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35 transition-colors duration-500" />
        {!!card.views && (
          <div className="absolute bottom-3 right-3 rounded-full bg-ink/75 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-ivory">
            {formatCount(card.views)} views
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
          <PlayDisc big={featured} />
        </div>
      </div>

      <div className="pt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint mb-1.5">
            {String(idx + 1).padStart(2, "0")} / {card.meta}
          </p>
          <h3 className={`font-display font-light text-ivory leading-snug group-hover:text-gold transition-colors line-clamp-2 ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
            {card.title}
          </h3>
        </div>
        <ArrowUpRight size={featured ? 22 : 16} className="mt-5 shrink-0 text-ivory/40 group-hover:text-gold group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" />
      </div>
    </motion.a>
  );
}

/** Portrait card for the mobile swipe deck: thumbnail on top, title below, on one solid surface. */
function DeckVideoCard({ card, idx }: { card: Card; idx: number }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-ink-3 ring-1 ring-line shadow-2xl shadow-black/40">
      <div className="relative aspect-video shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.thumb}
          alt={card.title}
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.includes("maxresdefault")) img.src = img.src.replace("maxresdefault", "hqdefault");
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayDisc />
        </div>
        {!!card.views && (
          <div className="absolute bottom-3 right-3 rounded-full bg-ink/75 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-ivory">
            {formatCount(card.views)} views
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint mb-2">
            {String(idx + 1).padStart(2, "0")} / {card.meta}
          </p>
          <h3 className="font-display font-light text-ivory text-xl leading-snug line-clamp-3">{card.title}</h3>
        </div>
        <p className="flex items-center gap-2 text-xs font-medium text-gold">
          <YoutubeIcon size={14} /> Watch on YouTube <ArrowUpRight size={14} />
        </p>
      </div>
    </div>
  );
}

function SkeletonCard({ featured }: { featured?: boolean }) {
  return <div className={`rounded-md bg-ivory/[0.04] animate-pulse aspect-video ${featured ? "md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[420px]" : ""}`} />;
}

export default function YouTubeSection() {
  const [data, setData] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((d: YouTubeApiResponse) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const apiActive = !!(data?.configured && data.videos.length > 0);

  const cards: Card[] = apiActive
    ? data!.videos.slice(0, 5).map((v) => ({
        key: v.id,
        href: `https://www.youtube.com/watch?v=${v.videoId}`,
        thumb: v.thumbnail,
        title: shortTitle(v.title),
        fullTitle: v.title,
        views: v.views,
        meta: new Date(v.publishedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      }))
    : YOUTUBE_VIDEOS.slice(0, 5).map((v, i) => {
        const isReal = v.id.trim() !== "";
        return {
          key: v.id || `placeholder-${i}`,
          href: isReal ? `https://www.youtube.com/watch?v=${v.id}` : CHANNEL_URL,
          thumb: isReal ? `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg` : FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
          title: v.title,
          meta: v.tag,
        };
      });

  return (
    <section id="youtube" className="relative py-28 md:py-40 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          index="01"
          eyebrow="Travel diaries · YouTube"
          title={<>Roads less <span className="italic text-gilded">travelled</span></>}
          description="Hikes, highways and the quiet stories in between — filmed, cut and told from the road."
          aside={
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-sm font-medium text-ivory"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 group-hover:bg-[#ff0000] group-hover:border-[#ff0000] transition-colors">
                <YoutubeIcon size={16} />
              </span>
              <span className="link-underline">Subscribe on YouTube</span>
            </a>
          }
        />

        {/* Mobile: swipeable card stack */}
        <div className="md:hidden">
          {loading ? (
            <div className="mx-auto w-[min(84vw,360px)] h-[400px] rounded-[22px] bg-ivory/[0.04] animate-pulse" />
          ) : (
            <SwipeDeck
              items={cards}
              getHref={(c) => c.href}
              getLabel={(c) => c.title}
              renderCard={(c) => <DeckVideoCard card={c} idx={cards.indexOf(c)} />}
              className="mx-auto w-[min(84vw,360px)] h-[400px]"
            />
          )}
        </div>

        <div className="hidden md:grid grid-cols-4 gap-x-6 gap-y-10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} featured={i === 0} />)
            : cards.map((c, i) => <VideoCard key={c.key} card={c} idx={i} featured={i === 0} />)}
        </div>
      </div>
    </section>
  );
}
