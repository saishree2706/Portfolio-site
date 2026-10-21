"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Swatches mirror the body[data-palette] blocks in globals.css — keep them in sync. */
const PALETTES = [
  { id: "noir", name: "Gilded Noir", note: "Current", colors: ["#0c0a09", "#f4ece0", "#d6b37a", "#e9a28c"] },
  { id: "henna", name: "Henna Night", note: "Earthy, mehendi-inspired", colors: ["#1a0f0a", "#f6ead8", "#e8b04b", "#c8553d"] },
  { id: "peacock", name: "Peacock", note: "Teal & marigold", colors: ["#0b1a1e", "#f1ede4", "#1fa39a", "#e0a43a"] },
  { id: "sunset", name: "Sunset Ghat", note: "Bold, creator vibe", colors: ["#160d1f", "#fbeee6", "#ff7a59", "#f4c26b"] },
  { id: "editorial", name: "Editorial Light", note: "Magazine, light mode", colors: ["#f3ede3", "#1c1714", "#b4432f", "#2f5d50"] },
] as const;

type PaletteId = (typeof PALETTES)[number]["id"];

const STORAGE_KEY = "passion-palette";

function applyPalette(id: PaletteId) {
  if (id === "noir") delete document.body.dataset.palette;
  else document.body.dataset.palette = id;
}

/** Temporary preview tool for choosing the passion-mode colour scheme. */
export default function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<PaletteId>("noir");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as PaletteId | null;
    if (saved && PALETTES.some((p) => p.id === saved)) {
      // Read after mount to keep SSR markup consistent
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPalette(saved);
      applyPalette(saved);
    }
    // Profession mode has its own colours, so drop the override when this unmounts
    return () => {
      delete document.body.dataset.palette;
    };
  }, []);

  function choose(id: PaletteId) {
    setPalette(id);
    applyPalette(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className="fixed bottom-6 right-5 md:bottom-24 md:right-auto md:left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 md:right-auto md:left-0 w-72 rounded-2xl border border-line bg-ink-2/95 backdrop-blur-xl p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint">Colour palette</p>
              <button onClick={() => setOpen(false)} className="text-ivory-faint hover:text-ivory" aria-label="Close palette switcher">
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-1">
              {PALETTES.map((p) => {
                const active = palette === p.id;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => choose(p.id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                        active ? "bg-ivory/10" : "hover:bg-ivory/5"
                      )}
                    >
                      <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-ivory/20">
                        {p.colors.map((c) => (
                          <span key={c} className="h-6 w-3" style={{ background: c }} />
                        ))}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-ivory">{p.name}</span>
                        <span className="block text-[11px] text-ivory-faint truncate">{p.note}</span>
                      </span>
                      {active && <Check size={14} className="text-gold" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colour palette"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink shadow-lg transition-transform hover:scale-105"
      >
        <Palette size={20} />
      </button>
    </div>
  );
}
