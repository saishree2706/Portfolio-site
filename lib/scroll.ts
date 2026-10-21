import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Scroll via Lenis when available so programmatic scrolls share the same easing. */
export function scrollToTarget(target: number | string, opts: { immediate?: boolean; offset?: number } = {}) {
  if (instance) {
    instance.scrollTo(target, { offset: opts.offset ?? -72, immediate: opts.immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: opts.immediate ? "auto" : "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth" });
  }
}
