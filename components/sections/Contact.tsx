"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { PROFESSION_SNIPPETS, PROFILE, SOCIALS } from "@/data/site";
import EmailSnippets from "@/components/EmailSnippets";
import { cn } from "@/lib/utils";
import { Accent, reveal } from "./SectionHeading";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Try emailing me directly.");
    } finally {
      setSubmitting(false);
    }
  }

  const links = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, Icon: Mail },
    { label: "GitHub", value: SOCIALS.github.replace("https://", ""), href: SOCIALS.github, Icon: GithubIcon },
    { label: "LinkedIn", value: "in/saishree-sriram", href: SOCIALS.linkedin, Icon: LinkedinIcon },
  ];

  return (
    <section id="contact" className="relative py-28 md:py-36 scroll-mt-16 overflow-hidden">
      <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-sky-200/40 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14">
        <motion.div {...reveal} className="lg:col-span-5 flex flex-col">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
            <span className="text-accent">05</span><span className="h-px w-8 bg-slate-300" />Contact
          </p>
          <h2 className="mt-5 text-5xl md:text-7xl font-semibold tracking-[-0.045em] leading-[0.98] text-foreground">
            Let&apos;s build something <Accent>great.</Accent>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-secondary max-w-md">
            Have a project in mind, a role to discuss, or just want to say hello? My inbox is always open.
          </p>

          <div className="mt-10 lg:mt-auto space-y-2">
            {links.map(({ label, value, href, Icon }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4 hover:border-foreground transition-colors">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-foreground group-hover:text-white transition-colors">
                  <Icon size={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{value}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-7 rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.4)] space-y-6"
        >
          <EmailSnippets
            variant="profession"
            snippets={PROFESSION_SNIPPETS}
            onUse={(s) => {
              setValue("subject", s.subject, { shouldValidate: true });
              setValue("message", s.body, { shouldValidate: true });
            }}
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Name" error={errors.name?.message}>
              <input {...register("name")} placeholder="Jane Doe" className={inputClass(!!errors.name)} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="you@company.com" className={inputClass(!!errors.email)} />
            </Field>
          </div>
          <Field label="Subject" error={errors.subject?.message}>
            <input {...register("subject")} placeholder="What's this about?" className={inputClass(!!errors.subject)} />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea {...register("message")} rows={6} placeholder="Tell me about your project or opportunity…" className={cn(inputClass(!!errors.message), "resize-none")} data-lenis-prevent />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="group w-full flex items-center justify-between rounded-full bg-foreground pl-7 pr-2 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Sending…" : "Send message"}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-foreground transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-foreground placeholder:text-slate-400",
    "focus:outline-none focus:bg-white focus:ring-4 transition-all",
    hasError ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</span>
      {children}
      {error && <span className="block text-red-500 text-xs mt-1.5 font-medium">{error}</span>}
    </label>
  );
}
