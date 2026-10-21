"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Resting pose for the top card and the two peeking out beneath it. */
const DEPTH = [
  { scale: 1, y: 0, rotate: 0, opacity: 1 },
  { scale: 0.92, y: 30, rotate: 5, opacity: 0.9 },
  { scale: 0.84, y: 58, rotate: -5, opacity: 0.65 },
];
const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 500;

type Exit = { fling: number; back: boolean };

/** Mobile card stack: swipe the top card left or right to send it away and reveal the next. Tap opens it. */
export default function SwipeDeck<T>({
  items,
  getHref,
  getLabel,
  renderCard,
  className,
}: {
  items: T[];
  getHref: (item: T) => string;
  getLabel: (item: T) => string;
  renderCard: (item: T) => ReactNode;
  className?: string;
}) {
  // Unbounded position so every card that cycles back in gets a fresh key and animates in
  const [pos, setPos] = useState(0);
  const [exit, setExit] = useState<Exit>({ fling: -1, back: false });
  const [touched, setTouched] = useState(false);

  const n = items.length;
  if (n === 0) return null;

  const visible = Math.min(DEPTH.length, n);
  const index = ((pos % n) + n) % n;
  const at = (p: number) => items[((p % n) + n) % n];

  function next(fling: number) {
    setExit({ fling, back: false });
    setPos((p) => p + 1);
    setTouched(true);
  }

  function prev() {
    setExit({ fling: -1, back: true });
    setPos((p) => p - 1);
    setTouched(true);
  }

  const slots = Array.from({ length: visible }, (_, depth) => pos + depth).reverse();

  return (
    <div>
      <div className={cn("relative", className)}>
        <AnimatePresence initial={false} custom={exit}>
          {slots.map((p) => {
            const depth = p - pos;
            const item = at(p);
            const enteringFromSide = exit.back && depth === 0;
            return (
              <DeckCard
                key={p}
                depth={depth}
                initial={
                  enteringFromSide
                    ? { x: -480, rotate: -24, opacity: 0, scale: 1, y: 0 }
                    : { scale: 0.76, y: 86, rotate: 0, opacity: 0 }
                }
                href={getHref(item)}
                label={getLabel(item)}
                onSwipe={next}
              >
                {renderCard(item)}
              </DeckCard>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex items-center justify-between gap-4">
        <DeckButton onClick={prev} label="Previous">
          <ArrowLeft size={16} />
        </DeckButton>

        <div className="flex flex-col items-center gap-2.5">
          <p className="font-mono text-[11px] tracking-[0.25em] text-ivory-faint tabular-nums">
            <span className="text-ivory">{String(index + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
          </p>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-6 bg-gold" : "w-1.5 bg-ivory/20")}
              />
            ))}
          </div>
        </div>

        <DeckButton onClick={() => next(-1)} label="Next">
          <ArrowRight size={16} />
        </DeckButton>
      </div>

      <AnimatePresence>
        {!touched && (
          <motion.p
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="mt-5 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-ivory-faint"
          >
            <motion.span animate={{ x: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>←</motion.span>
            Swipe
            <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeckCard({
  depth,
  initial,
  href,
  label,
  onSwipe,
  children,
}: {
  depth: number;
  initial: Record<string, number>;
  href: string;
  label: string;
  onSwipe: (fling: number) => void;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const tilt = useTransform(x, [-220, 220], [-14, 14]);
  const dragged = useRef(false);
  const isTop = depth === 0;
  const pose = DEPTH[depth];

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_DISTANCE || Math.abs(velocity.x) > SWIPE_VELOCITY) {
      onSwipe(Math.sign(offset.x || velocity.x));
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    }
    // The click event fires right after pointerup; let it see the drag flag first
    setTimeout(() => (dragged.current = false), 0);
  }

  return (
    <motion.div
      initial={initial}
      animate={pose}
      exit="exit"
      variants={{
        exit: (e: Exit) =>
          e.back
            ? { opacity: 0, scale: 0.76, y: 86, transition: { duration: 0.3 } }
            : { x: e.fling * 520, rotate: e.fling * 26, opacity: 0, zIndex: 20, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } },
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn("absolute inset-0", !isTop && "pointer-events-none")}
      style={{ zIndex: DEPTH.length - depth }}
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        aria-hidden={!isTop}
        tabIndex={isTop ? 0 : -1}
        draggable={false}
        drag={isTop ? "x" : false}
        dragMomentum={false}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          if (dragged.current) e.preventDefault();
        }}
        style={{ x, rotate: tilt }}
        className={cn("block h-full select-none touch-pan-y", isTop && "cursor-grab active:cursor-grabbing")}
      >
        {children}
      </motion.a>
    </motion.div>
  );
}

function DeckButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory-dim active:scale-95 hover:border-gold hover:text-gold transition-all"
    >
      {children}
    </button>
  );
}
