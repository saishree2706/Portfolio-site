"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll";

export type Mode = "passion" | "profession";

interface ModeCtx {
  mode: Mode;
  toggle: () => void;
}

const ModeContext = createContext<ModeCtx>({ mode: "passion", toggle: () => {} });

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("passion");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // Read after mount to keep SSR markup consistent
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p.get("mode") === "profession") setMode("profession");
  }, []);

  useEffect(() => {
    document.body.dataset.mode = mode;
  }, [mode]);

  function toggle() {
    const next: Mode = mode === "passion" ? "profession" : "passion";
    setMode(next);
    // Content is swapped wholesale, so jump rather than animate through it
    scrollToTarget(0, { immediate: true, offset: 0 });
    const url = new URL(window.location.href);
    if (next === "profession") url.searchParams.set("mode", "profession");
    else url.searchParams.delete("mode");
    window.history.pushState({}, "", url.toString());
  }

  return <ModeContext.Provider value={{ mode, toggle }}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);
