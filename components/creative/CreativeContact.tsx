"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "./SectionHeader";
import { PASSION_SNIPPETS, PROFILE } from "@/data/site";
import EmailSnippets from "@/components/EmailSnippets";

const SERVICES = [
  { id: "content", label: "Content creation" },
  { id: "webdev", label: "Web development" },
] as const;

type ServiceId = (typeof SERVICES)[number]["id"];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  service: z.enum(["content", "webdev"], { error: "Please select a service" }),
  message: z.string().min(10, "Please write at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CreativeContact() {
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceId>("content");
  const [snippetSubject, setSnippetSubject] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { service: "content" } });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subject: snippetSubject ?? `${SERVICES.find((s) => s.id === data.service)?.label} enquiry`,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Request sent — I'll be in touch soon ✦");
      reset();
      setSelectedService("content");
      setSnippetSubject(null);
    } catch {
      toast.error("Something went wrong. Try emailing me directly.");
    } finally {
      setSubmitting(false);
    }
  }

  function selectService(id: ServiceId) {
    setSelectedService(id);
    setValue("service", id);
    setSnippetSubject(null);
  }

  return (
    <section id="creative-contact" className="relative py-28 md:py-40 scroll-mt-16 overflow-hidden">
      <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, color-mix(in srgb, var(--gold) 12%, transparent), transparent 65%)" }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-16">
        {/* Left — statement */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex items-center gap-4 mb-8 font-mono text-[11px] tracking-[0.25em] uppercase text-ivory-faint"
            >
              <span className="text-gold">03</span>
              <span className="h-px w-10 bg-gold/40" />
              <span>Let&apos;s collaborate</span>
            </motion.div>
            <motion.h2
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true }}
              className="font-display font-light text-ivory text-[clamp(3rem,7vw,6.5rem)] leading-[0.95]"
            >
              {["Have a story", "worth telling?"].map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
                    transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
                    className={cn("block", i === 1 && "italic text-gilded")}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
            <p className="mt-8 text-[15px] leading-relaxed text-ivory-dim max-w-md">
              Brand reels, travel collaborations, or a website that feels as good as it looks —
              tell me what you&apos;re dreaming up.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint">Or write directly</p>
            <a href={`mailto:${PROFILE.email}`} className="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-ivory hover:text-gold transition-colors">
              <span className="link-underline">{PROFILE.email}</span>
              <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

        {/* Right — form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="lg:col-span-6 rounded-[28px] border border-line bg-ink-2/80 backdrop-blur-xl p-8 md:p-10 space-y-9"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint mb-4">I&apos;m interested in</p>
            <div className="flex flex-wrap gap-3">
              {SERVICES.map((svc) => {
                const active = selectedService === svc.id;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => selectService(svc.id)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm transition-all duration-300",
                      active ? "bg-ivory border-ivory text-ink font-medium" : "border-ivory/15 text-ivory-dim hover:border-ivory/40 hover:text-ivory"
                    )}
                  >
                    {svc.label}
                  </button>
                );
              })}
            </div>
            {errors.service && <p className="text-rose text-xs mt-2">{errors.service.message}</p>}
          </div>

          <EmailSnippets
            key={selectedService}
            variant="passion"
            snippets={PASSION_SNIPPETS[selectedService]}
            onUse={(s) => {
              setSnippetSubject(s.subject);
              setValue("message", s.body, { shouldValidate: true });
            }}
          />

          <div className="grid sm:grid-cols-2 gap-9">
            <Field label="Your name" error={errors.name?.message}>
              <input {...register("name")} placeholder="Jane Doe" className={inputClass} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register("email")} type="email" placeholder="you@example.com" className={inputClass} />
            </Field>
          </div>

          <Field label="Tell me about your project" error={errors.message?.message}>
            <textarea
              {...register("message")}
              rows={4}
              placeholder={
                selectedService === "content"
                  ? "A 30-second brand reel for Instagram…"
                  : "A portfolio site with a contact form and gallery…"
              }
              className={cn(inputClass, "resize-none")}
              data-lenis-prevent
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="group w-full flex items-center justify-between rounded-full bg-gold pl-7 pr-2 py-2 text-sm font-semibold text-ink hover:bg-ivory disabled:opacity-50 transition-colors"
          >
            {submitting ? "Sending…" : "Send request"}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ivory transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </button>
        </motion.form>
      </div>
    </section>
  );
}

const inputClass =
  "peer w-full bg-transparent border-0 border-b border-ivory/15 px-0 py-3 text-[15px] text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-gold transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-ivory-faint">{label}</span>
      {children}
      {error && <span className="block text-rose text-xs mt-2">{error}</span>}
    </label>
  );
}
