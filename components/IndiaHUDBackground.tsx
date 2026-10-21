"use client";

import { INDIA_PATH, INDIA_VIEWBOX, pointOnBorder } from "@/lib/india-path";
import { MAP_STOPS } from "@/data/site";

const GOLD = "var(--gold)";
const NEON = "var(--neon)";
const LAP_SECONDS = 26;
const STOPS = MAP_STOPS.map((s) => ({ ...s, ...pointOnBorder(s.at) }));

/** Fixed passion-mode backdrop: India's border drawn in SVG with a neon light travelling along it. */
export default function IndiaHUDBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      <div className="absolute inset-0 bg-ink" />

      <svg
        viewBox={INDIA_VIEWBOX}
        className="absolute inset-0 m-auto h-[min(86vh,64vw)] w-auto overflow-visible"
      >
        <defs>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b1" />
            <feGaussianBlur stdDeviation="16" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="map-fill" cx="45%" cy="45%" r="60%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.05" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Landmass + static border */}
        <path id="india-border" d={INDIA_PATH} fill="url(#map-fill)" stroke={GOLD} strokeOpacity="0.16" strokeWidth="2" strokeLinejoin="round" />

        {/* Neon comet: a short dash with a long faded tail, both chasing around the border */}
        <g filter="url(#neon)">
          <path d={INDIA_PATH} pathLength={1000} fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" strokeDasharray="140 860">
            <animate attributeName="stroke-dashoffset" from="140" to="-860" dur={`${LAP_SECONDS}s`} repeatCount="indefinite" />
          </path>
          <path d={INDIA_PATH} pathLength={1000} fill="none" stroke={NEON} strokeWidth="4" strokeLinecap="round" strokeDasharray="22 978">
            <animate attributeName="stroke-dashoffset" from="22" to="-978" dur={`${LAP_SECONDS}s`} repeatCount="indefinite" />
          </path>
        </g>

        {/* Bright head */}
        <circle r="5" fill="var(--neon-head)" filter="url(#neon)">
          <animateMotion dur={`${LAP_SECONDS}s`} repeatCount="indefinite" calcMode="linear">
            <mpath href="#india-border" />
          </animateMotion>
        </circle>

        {/* Stops */}
        {STOPS.map((s) => (
          <g key={s.label} transform={`translate(${s.x} ${s.y})`}>
            {s.main && (
              <circle r="8" fill="none" stroke={GOLD} strokeWidth="2">
                <animate attributeName="r" from="6" to="34" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r="5" fill={GOLD} opacity="0.7" />
            <text x="16" y="6" fill={GOLD} opacity="0.32" fontSize="20" letterSpacing="5" fontFamily="var(--font-geist-mono), monospace">
              {s.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>

      {/* Vignette keeps edges calm */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, color-mix(in srgb, var(--ink) 85%, transparent) 100%)" }} />
    </div>
  );
}
