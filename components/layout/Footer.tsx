"use client";

import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { useMode } from "@/context/ModeContext";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { PROFILE, SOCIALS as LINKS } from "@/data/site";

const SOCIALS = [
  { label: "GitHub", href: LINKS.github, Icon: GithubIcon },
  { label: "LinkedIn", href: LINKS.linkedin, Icon: LinkedinIcon },
];

export default function Footer() {
  const { mode } = useMode();
  const isPassion = mode === "passion";

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t",
        isPassion ? "bg-ink border-line text-ivory" : "bg-foreground border-transparent text-white"
      )}
      style={{ zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <p className={cn("max-w-sm text-sm leading-relaxed", isPassion ? "text-ivory-dim" : "text-white/60")}>
            Software engineer by day, storyteller on the road. Thanks for stopping by.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  "h-11 w-11 flex items-center justify-center rounded-full border transition-colors",
                  isPassion ? "border-ivory/15 hover:bg-ivory hover:text-ink" : "border-white/15 hover:bg-white hover:text-foreground"
                )}
              >
                <Icon size={16} />
              </a>
            ))}
            <button
              onClick={() => scrollToTarget(0, { offset: 0 })}
              aria-label="Back to top"
              className={cn(
                "h-11 w-11 flex items-center justify-center rounded-full transition-colors",
                isPassion ? "bg-gold text-ink hover:bg-ivory" : "bg-accent text-white hover:bg-white hover:text-foreground"
              )}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Signature wordmark */}
        <p
          aria-hidden
          className={cn(
            "select-none leading-[0.8] tracking-tight whitespace-nowrap",
            isPassion ? "font-display italic font-light text-gilded text-[clamp(4rem,17vw,15rem)]" : "font-black text-white/10 text-[clamp(3rem,13vw,12rem)]"
          )}
        >
          {PROFILE.name}
        </p>

        <div className={cn("mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between gap-3 font-mono text-[10px] tracking-[0.2em] uppercase",
          isPassion ? "border-line text-ivory-faint" : "border-white/10 text-white/40")}>
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Built with Next.js & Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
