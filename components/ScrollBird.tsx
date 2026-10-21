"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useMode } from "@/context/ModeContext";
import { scrollToTarget } from "@/lib/scroll";

const TOP_PAD = 96;
const BOTTOM_PAD = 72;

/**
 * A companion that flies down the right edge as you scroll.
 * Passion mode: a gold bird that flaps faster while scrolling and glides at rest.
 * Profession mode: a paper plane. Click either to jump back to the top.
 */
export default function ScrollBird() {
  const { mode } = useMode();
  const isPassion = mode === "passion";
  const { scrollYProgress, scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  const [trackH, setTrackH] = useState(0);
  const [flapping, setFlapping] = useState(false);
  const [goingUp, setGoingUp] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const measure = () => setTrackH(window.innerHeight - TOP_PAD - BOTTOM_PAD);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });
  const y = useTransform(progress, (p) => TOP_PAD + p * trackH);
  // Gentle sideways drift so the flight path reads as a curve, not a rail
  const x = useTransform(progress, (p) => Math.sin(p * Math.PI * 4) * 10);
  // Bank into the direction of travel
  const tilt = useSpring(useTransform(velocity, [-2500, 0, 2500], [-28, 0, 28]), { stiffness: 120, damping: 18 });
  const trailScale = useTransform(progress, (p) => p);

  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) < 40) return;
    setFlapping(true);
    setGoingUp(v < 0);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setFlapping(false), 260);
  });

  if (!trackH) return null;

  const color = isPassion ? "var(--gold)" : "#0ea5e9";

  return (
    <div className="fixed right-5 top-0 bottom-0 z-40 hidden lg:block w-12 pointer-events-none" aria-hidden="true">
      <style>{`
        @keyframes wing-up   { 0%,100% { transform: rotate(0deg) }  50% { transform: rotate(-38deg) } }
        @keyframes wing-down { 0%,100% { transform: rotate(0deg) }  50% { transform: rotate(38deg) } }
        @keyframes bob       { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
      `}</style>

      {/* Flight path: faint dotted line, solid behind the bird */}
      <div
        className="absolute left-1/2 w-px -translate-x-1/2"
        style={{
          top: TOP_PAD,
          height: trackH,
          backgroundImage: `linear-gradient(${color}33 50%, transparent 50%)`,
          backgroundSize: "1px 8px",
        }}
      />
      <motion.div
        className="absolute left-1/2 w-px -translate-x-1/2 origin-top"
        style={{ top: TOP_PAD, height: trackH, scaleY: trailScale, background: `linear-gradient(${color}00, ${color}aa)` }}
      />

      <motion.button
        type="button"
        onClick={() => scrollToTarget(0, { offset: 0 })}
        title="Fly back to top"
        className="pointer-events-auto absolute left-1/2 -ml-6 -mt-6 h-12 w-12 flex items-center justify-center cursor-pointer"
        style={{ y, x, rotate: tilt }}
        whileHover={{ scale: 1.15 }}
      >
        {isPassion ? (
          <Bird color={color} flapping={flapping} facingUp={goingUp} />
        ) : (
          <PaperPlane color={color} facingUp={goingUp} />
        )}
      </motion.button>
    </div>
  );
}

function Bird({ color, flapping, facingUp }: { color: string; flapping: boolean; facingUp: boolean }) {
  const speed = flapping ? "0.22s" : "1.6s";
  return (
    <svg
      viewBox="-30 -20 60 40"
      className="w-11 h-11 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--gold)_55%,transparent)] transition-transform duration-500"
      style={{ transform: facingUp ? "scaleY(-1)" : "none", animation: flapping ? "none" : "bob 1.6s ease-in-out infinite" }}
    >
      {/* Far wing */}
      <path
        d="M -2 0 C -8 -4 -18 -10 -26 -6 C -18 -4 -10 0 -2 3 Z"
        fill={color}
        opacity="0.55"
        style={{ transformOrigin: "-2px 1px", animation: `wing-up ${speed} ease-in-out infinite` }}
      />
      {/* Body (pointing down = direction of flight) */}
      <path d="M 0 -10 C 4 -6 4 6 0 12 C -4 6 -4 -6 0 -10 Z" fill={color} />
      {/* Head + beak */}
      <circle cx="0" cy="11" r="3.2" fill={color} />
      <path d="M -1.2 13.5 L 0 17 L 1.2 13.5 Z" fill="var(--ivory)" />
      {/* Tail */}
      <path d="M 0 -9 L -4 -16 L 0 -13 L 4 -16 Z" fill={color} opacity="0.8" />
      {/* Near wing */}
      <path
        d="M 2 0 C 8 -4 18 -10 26 -6 C 18 -4 10 0 2 3 Z"
        fill={color}
        style={{ transformOrigin: "2px 1px", animation: `wing-down ${speed} ease-in-out infinite` }}
      />
    </svg>
  );
}

function PaperPlane({ color, facingUp }: { color: string; facingUp: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 drop-shadow-[0_4px_10px_rgba(14,165,233,0.35)] transition-transform duration-500"
      style={{ transform: facingUp ? "rotate(-45deg)" : "rotate(135deg)" }}
    >
      <path d="M2 11.5 21.5 3 14 21.5l-3-7.5L2 11.5Z" fill={color} />
      <path d="M11 14 21.5 3" stroke="#fff" strokeWidth="1" opacity="0.7" />
      <path d="M11 14v4.5l2.2-2.8" fill="#0284c7" />
    </svg>
  );
}
