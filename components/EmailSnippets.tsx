"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, MailPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PROFILE, type EmailSnippet } from "@/data/site";
import { cn } from "@/lib/utils";

type Variant = "passion" | "profession";

const THEME: Record<Variant, { label: string; chip: string; chipActive: string; card: string; body: string; action: string }> = {
  passion: {
    label: "font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint",
    chip: "border-ivory/15 text-ivory-dim hover:border-gold/60 hover:text-ivory",
    chipActive: "border-gold bg-gold/10 text-gold",
    card: "border-gold/25 bg-ink/60",
    body: "text-ivory-dim",
    action: "text-ivory-faint hover:text-gold",
  },
  profession: {
    label: "font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500",
    chip: "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:text-foreground",
    chipActive: "border-blue-500 bg-blue-50 text-blue-700",
    card: "border-blue-100 bg-blue-50/50",
    body: "text-slate-600",
    action: "text-slate-500 hover:text-blue-600",
  },
};

/** Quick-start message templates: tap to fill the form, or copy / open in the visitor's own mail app. */
export default function EmailSnippets({
  snippets,
  variant,
  onUse,
}: {
  snippets: EmailSnippet[];
  variant: Variant;
  onUse: (snippet: EmailSnippet) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = THEME[variant];
  const current = snippets.find((s) => s.label === active);

  function pick(snippet: EmailSnippet) {
    setActive(snippet.label);
    setCopied(false);
    onUse(snippet);
  }

  async function copy(snippet: EmailSnippet) {
    try {
      await navigator.clipboard.writeText(snippet.body);
      setCopied(true);
      toast.success("Template copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the text instead");
    }
  }

  const mailto = (s: EmailSnippet) =>
    `mailto:${PROFILE.email}?subject=${encodeURIComponent(s.subject)}&body=${encodeURIComponent(s.body)}`;

  return (
    <div>
      <p className={cn(t.label, "mb-3 flex items-center gap-2")}>
        <Sparkles size={12} /> Quick start — tap a template
      </p>
      <div className="flex flex-wrap gap-2">
        {snippets.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => pick(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300",
              active === s.label ? t.chipActive : t.chip
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.label}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={cn("mt-4 rounded-2xl border p-4", t.card)}>
              <p className={cn("text-xs leading-relaxed", t.body)}>
                Filled in below — swap the <span className="font-semibold">[brackets]</span> with your details. Prefer your own inbox?
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium">
                <a href={mailto(current)} className={cn("inline-flex items-center gap-1.5 transition-colors", t.action)}>
                  <MailPlus size={14} /> Open in email app
                </a>
                <button type="button" onClick={() => copy(current)} className={cn("inline-flex items-center gap-1.5 transition-colors", t.action)}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy text"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
