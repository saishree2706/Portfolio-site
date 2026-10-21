"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode/ModeToggle";
import { useMode } from "@/context/ModeContext";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { PROFILE } from "@/data/site";

const PROFESSION_LINKS = [
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

const PASSION_LINKS = [
  { label: "Travels", href: "#youtube" },
  { label: "Reels",   href: "#reels" },
  { label: "Contact", href: "#creative-contact" },
];

export default function Navbar() {
  const { mode } = useMode();
  const isPassion = mode === "passion";
  // Drawer state is keyed to the mode it was opened in, so switching mode closes it
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === mode;
  const setOpen = (v: boolean) => setOpenFor(v ? mode : null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  const links = isPassion ? PASSION_LINKS : PROFESSION_LINKS;

  // Highlight the section currently in view
  useEffect(() => {
    const els = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links]);

  const cta = isPassion ? "#creative-contact" : "#contact";

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
    >
      <div
        className={cn(
          "mx-auto max-w-7xl h-14 flex items-center justify-between gap-4 rounded-full pl-6 pr-2 transition-all duration-500",
          scrolled
            ? isPassion
              ? "bg-ink/70 backdrop-blur-xl border border-line shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              : "bg-white/80 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            : "border border-transparent"
        )}
      >
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); scrollToTarget(0, { offset: 0 }); }}
          className={cn("text-lg tracking-tight select-none", isPassion ? "font-display italic text-ivory" : "font-black text-foreground")}
        >
          {PROFILE.shortName}<span className={isPassion ? "text-gold" : "text-accent"}>.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-4 py-2 text-sm rounded-full transition-colors",
                  isPassion
                    ? isActive ? "text-ink" : "text-ivory/65 hover:text-ivory"
                    : isActive ? "text-white" : "text-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={`nav-pill-${mode}`}
                    className={cn("absolute inset-0 rounded-full", isPassion ? "bg-ivory" : "bg-foreground")}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          <a
            href={cta}
            className={cn(
              "px-5 h-10 inline-flex items-center rounded-full text-sm font-semibold transition-colors",
              isPassion ? "bg-gold text-ink hover:bg-ivory" : "bg-accent text-white hover:bg-accent-dark"
            )}
          >
            {isPassion ? "Book me" : "Hire me"}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn("md:hidden h-10 w-10 flex items-center justify-center rounded-full", isPassion ? "text-ivory" : "text-foreground")}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "md:hidden mx-auto max-w-7xl mt-2 rounded-3xl p-6 space-y-1 backdrop-blur-xl border",
              isPassion ? "bg-ink/95 border-line" : "bg-white/95 border-border"
            )}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn("block py-2 text-2xl", isPassion ? "font-display text-ivory" : "font-semibold text-foreground")}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-5 flex flex-col gap-3">
              <ModeToggle />
              <a
                href={cta}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-center px-4 py-3 rounded-full text-sm font-semibold",
                  isPassion ? "bg-gold text-ink" : "bg-accent text-white"
                )}
              >
                {isPassion ? "Book me" : "Hire me"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
