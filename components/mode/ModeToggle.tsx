"use client";

import { motion } from "framer-motion";
import { useMode } from "@/context/ModeContext";

export function ModeToggle() {
  const { mode, toggle } = useMode();
  const isPassion = mode === "passion";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isPassion ? "profession" : "passion"} mode`}
      className={`relative grid grid-cols-2 items-center rounded-full p-1 shrink-0 border transition-colors ${
        isPassion ? "border-ivory/15 bg-ivory/[0.04]" : "border-border bg-slate-100"
      }`}
      style={{ width: 196, height: 38 }}
    >
      <motion.span
        className={`absolute top-1 bottom-1 rounded-full ${isPassion ? "bg-ivory" : "bg-foreground"}`}
        style={{ width: "calc(50% - 4px)" }}
        initial={false}
        animate={{ left: isPassion ? "50%" : 4 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
      <span className={`relative z-10 text-center text-[11px] font-semibold tracking-wide transition-colors ${!isPassion ? "text-white" : "text-ivory/55"}`}>
        Profession
      </span>
      <span className={`relative z-10 text-center text-[11px] font-semibold tracking-wide transition-colors ${isPassion ? "text-ink" : "text-muted"}`}>
        Passion
      </span>
    </button>
  );
}
