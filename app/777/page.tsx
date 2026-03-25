"use client";

import { useState, useRef, useCallback } from "react";
import {
  Palette,
  LayoutGrid,
  MessageCircle,
  FileText,
  Server,
  Phone,
  Mail,
} from "lucide-react";
import {
  heroContent,
  features,
  testimonials,
  footerContent,
  formFields,
} from "@/components/777/content";
import { useSlideIn } from "@/components/777/useSlideIn";
import MagicBento from "@/components/777/MagicBento";
import ChatIllustration from "@/components/777/ChatIllustration";
import FormIllustration from "@/components/777/FormIllustration";

type IconName = "Palette" | "LayoutGrid" | "MessageCircle" | "FileText" | "Server";

const iconMap: Record<IconName, React.ReactNode> = {
  Palette: <Palette className="w-6 h-6" strokeWidth={1.5} />,
  LayoutGrid: <LayoutGrid className="w-6 h-6" strokeWidth={1.5} />,
  MessageCircle: <MessageCircle className="w-6 h-6" strokeWidth={1.5} />,
  FileText: <FileText className="w-6 h-6" strokeWidth={1.5} />,
  Server: <Server className="w-6 h-6" strokeWidth={1.5} />,
};

export default function LandingPage777() {
  const featuresRef = useSlideIn();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = "/777/video-loop.mp4";
    video.loop = true;
    video.play();
    setVideoEnded(true);
  }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Rate limit — 60 seconds between submissions
    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      setError("נא להמתין דקה לפני שליחה נוספת");
      return;
    }

    // Block if already submitted
    if (submitted) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "8ad96ecd-8387-4094-97e0-1436c0679e30",
          subject: "ליד חדש מדף 777",
          from_name: form.name,
          name: form.name,
          phone: form.phone,
          email: form.email,
        }),
      });
      setLastSubmitTime(Date.now());
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
      <div
        dir="rtl"
        data-page="777"
        className="bg-black text-white font-sans antialiased"
      >

      {/* SECTION 1 — HERO */}
      <section className="relative isolate min-h-screen flex items-center overflow-hidden">

        {/* Site header — z-50 to stay above everything */}
        <div className="absolute top-0 left-0 right-0 max-w-7xl mx-auto flex items-center justify-between" style={{ zIndex: 50, padding: "1.5rem 1.5rem" }}>
          <a href="/he" className="hero-animate" style={{ animationDelay: "0.1s" }}><img src="/logo-vertical-no-digital.svg" alt="Kohelet Digital" className="h-12 sm:h-14" /></a>
          <button
            type="button"
            onClick={scrollToForm}
            className="hero-animate text-sm rounded-full cursor-pointer transition-colors duration-200"
            style={{ animationDelay: "0.2s", border: "1px solid rgba(251,191,36,0.4)", color: "#fcd34d", padding: "0.5rem 1.25rem" }}
          >
            צור קשר
          </button>
        </div>

        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          loop={videoEnded}
          muted
          playsInline
          src="/777/video.mp4"
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] sm:object-center"
          style={{ zIndex: -10 }}
          suppressHydrationWarning
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 hero-animate-fade" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: -5 }} />

        {/* Subtle gold radial glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(251,191,36,0.10), transparent)", zIndex: -4 }} />

        {/* Content */}
        <div className="relative z-10 w-full" style={{ padding: "0 1.5rem" }}>
          <div className="max-w-7xl mx-auto">
          <div className="max-w-xl">

            <span
              className="hero-animate inline-flex items-center gap-2 text-sm font-semibold rounded-full"
              style={{ animationDelay: "0.3s", backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", color: "#fcd34d", padding: "0.5rem 1.25rem", marginBottom: "2rem" }}
            >
              <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>★</span>
              מבצע מוגבל — 777 ₪ בלבד
              <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>★</span>
            </span>

            <h1
              className="hero-animate text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight"
              style={{ animationDelay: "0.5s", color: "#fbbf24", marginBottom: "1.5rem", fontWeight: 900 }}
            >
              {heroContent.headline}
            </h1>

            <p
              className="hero-animate text-base sm:text-lg lg:text-xl leading-relaxed"
              style={{ animationDelay: "0.7s", color: "rgba(254,243,199,0.75)", marginBottom: "2.5rem" }}
            >
              {heroContent.subheadline}
            </p>

            <button
              type="button"
              onClick={scrollToForm}
              className="hero-animate font-extrabold text-lg rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ animationDelay: "0.9s", background: "linear-gradient(to left, #f59e0b, #facc15)", color: "#000000", padding: "1.25rem 2.5rem", boxShadow: "0 10px 15px -3px rgba(245,158,11,0.3)" }}
            >
              {heroContent.ctaButton}
            </button>

            <div
              className="hero-animate mt-10 flex items-center gap-3"
              style={{ animationDelay: "1.1s" }}
            >
              <div className="flex -space-x-2">
                {(["ק", "ה", "ל", "ת"] as const).map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-amber-400/60 bg-gradient-to-br from-amber-700 to-yellow-600 flex items-center justify-center text-sm font-bold text-black shadow select-none"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-amber-200/70 text-sm flex flex-col gap-1">
                <span className="text-amber-300 font-semibold">הצטרפו היום לעשרות+ לקוחות מרוצים</span>{" "}
                <span>שהשיקו דף נחיתה השנה</span>{" "}
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Watermark cover — bottom right, above video but below content */}
        <div className="absolute pointer-events-none" style={{ bottom: 0, right: 0, width: "13rem", height: "7rem", backgroundColor: "#000000", zIndex: 5 }} />

      </section>

      {/* SECTION 2 — FEATURES */}
      <section className="min-h-screen flex items-center py-16 sm:py-20" style={{ backgroundColor: "#09090b" }}>
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-3">
              מה כלול בחבילה
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ background: "linear-gradient(to left, #fcd34d, #facc15)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              הכל מוכן. הכל כלול.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
              כל מה שצריך כדי להתחיל לייצר לידים — ב-777 ₪ בלבד
            </p>
          </div>

          <MagicBento
            cards={[
              ...features.map((f) => ({
                icon: iconMap[f.icon as IconName],
                title: f.title,
                description: f.description,
                label: f.icon === "Palette" ? "עיצוב" : f.icon === "LayoutGrid" ? "מבנה" : f.icon === "MessageCircle" ? "תקשורת" : f.icon === "FileText" ? "לידים" : f.icon === "Server" ? "אחסון" : "",
                illustration: f.icon === "MessageCircle" ? <ChatIllustration /> : f.icon === "FileText" ? <FormIllustration /> : undefined,
              })),
              {
                icon: <span className="text-3xl font-black">₪</span>,
                title: "777 ₪ בלבד",
                description: "ב-7 ימי עסקים. ללא הפתעות. מחיר סופי.",
                label: "מחיר",
                variant: "gold" as const,
              },
            ]}
          />
        </div>
      </section>

      {/* SECTION 3 — LEAD FORM */}
      <section id="form" className="min-h-screen flex items-center py-16 sm:py-20" style={{ background: "linear-gradient(to bottom, #f59e0b, #facc15, #f59e0b)" }}>
        <div className="w-full max-w-xl mx-auto px-6 sm:px-8">
          <div className="text-center" style={{ marginBottom: "2rem" }}>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(0,0,0,0.6)", marginBottom: "0.75rem" }}>
              צור קשר
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#000000", marginBottom: "0.75rem" }}>
              השאר פרטים ונחזור אליך
            </h2>
            <p className="text-base" style={{ color: "rgba(0,0,0,0.7)" }}>
              חוזרים תוך שעה. ללא התחייבות.
            </p>
          </div>

          <div className="rounded-2xl" style={{ backgroundColor: "#09090b", padding: "2rem", boxShadow: "0 8px 60px rgba(0,0,0,0.5)" }}>
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto">
                  <span className="text-amber-400 text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-amber-400">
                  קיבלנו! נחזור אליך תוך שעה.
                </h3>
                <p className="text-zinc-300 text-sm">
                  תודה שפנית אלינו. נציג יצור עמך קשר בהקדם.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="lp-name" className="block text-sm font-medium" style={{ color: "rgba(253,230,138,0.8)" }}>{formFields.name}</label>
                  <input id="lp-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} placeholder="ישראל ישראלי" className="w-full rounded-xl text-base outline-none transition-all" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#ffffff", padding: "0.75rem 1rem" }} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lp-phone" className="block text-sm font-medium" style={{ color: "rgba(253,230,138,0.8)" }}>{formFields.phone}</label>
                  <input id="lp-phone" name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="050-000-0000" dir="ltr" className="w-full rounded-xl text-base outline-none transition-all text-right" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#ffffff", padding: "0.75rem 1rem" }} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lp-email" className="block text-sm font-medium" style={{ color: "rgba(253,230,138,0.8)" }}>{formFields.email}</label>
                  <input id="lp-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" dir="ltr" className="w-full rounded-xl text-base outline-none transition-all text-right" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#ffffff", padding: "0.75rem 1rem" }} />
                </div>
                <button type="submit" disabled={loading} className="w-full font-bold text-base rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: "linear-gradient(to left, #f59e0b, #facc15)", color: "#000000", padding: "1rem 0", marginTop: "0.5rem", boxShadow: "0 4px 6px -1px rgba(245,158,11,0.3)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      שולח...
                    </span>
                  ) : heroContent.ctaButton}
                </button>
                {error && <p className="text-center text-xs mt-1" style={{ color: "#ef4444" }}>{error}</p>}
                <p className="text-center text-xs mt-1" style={{ color: "#71717a" }}>הפרטים שלך מאובטחים ולא יועברו לצד שלישי</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TESTIMONIALS */}
      <section className="min-h-screen flex flex-col justify-center py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: "#09090b" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center mb-12">
          <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-3">מה אומרים עלינו</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-3">לקוחות מרוצים</h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">תוצאות אמיתיות, עסקים אמיתיים</p>
        </div>

        <div dir="ltr" className="w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex w-max marquee-scroll gap-6 py-4">
            {testimonials.slice(0, 8).map((t, i) => (
              <div key={`a-${i}`} dir="rtl" className="w-[340px] sm:w-[380px] shrink-0 rounded-2xl p-6 flex flex-col gap-4 bg-zinc-900 border border-amber-500/10 transition-all hover:border-amber-500/30 hover:shadow-xl">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed flex-1 text-zinc-300">&ldquo;{t.text}&rdquo;</blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-sm font-bold text-black shrink-0 select-none">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.slice(0, 8).map((t, i) => (
              <div key={`b-${i}`} aria-hidden="true" dir="rtl" className="w-[340px] sm:w-[380px] shrink-0 rounded-2xl p-6 flex flex-col gap-4 bg-zinc-900 border border-amber-500/10">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed flex-1 text-zinc-300">&ldquo;{t.text}&rdquo;</blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-sm font-bold text-black shrink-0 select-none">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second row — reverse direction, different speed, different testimonials */}
        <div dir="ltr" className="w-full overflow-hidden mt-3" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex w-max gap-6 py-4" style={{ animation: "marquee-777-reverse 35s linear infinite" }}>
            {testimonials.slice(8, 16).map((t, i) => (
              <div key={`c-${i}`} dir="rtl" className="w-[340px] sm:w-[380px] shrink-0 rounded-2xl flex flex-col gap-4 transition-all" style={{ backgroundColor: "#18181b", border: "1px solid rgba(245,158,11,0.1)", padding: "1.5rem" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 fill-current" style={{ color: "#fbbf24" }} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "#d4d4d8" }}>&ldquo;{t.text}&rdquo;</blockquote>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #27272a" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 select-none" style={{ background: "linear-gradient(to bottom right, #d97706, #eab308)", color: "#000" }}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#ffffff" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#71717a" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.slice(8, 16).map((t, i) => (
              <div key={`d-${i}`} aria-hidden="true" dir="rtl" className="w-[340px] sm:w-[380px] shrink-0 rounded-2xl flex flex-col gap-4" style={{ backgroundColor: "#18181b", border: "1px solid rgba(245,158,11,0.1)", padding: "1.5rem" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} className="w-4 h-4 fill-current" style={{ color: "#fbbf24" }} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "#d4d4d8" }}>&ldquo;{t.text}&rdquo;</blockquote>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #27272a" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 select-none" style={{ background: "linear-gradient(to bottom right, #d97706, #eab308)", color: "#000" }}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#ffffff" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#71717a" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#09090b", borderTop: "1px solid rgba(251,191,36,0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
          <div className="flex flex-col items-center gap-6">
            <h4 className="text-amber-400 text-xs font-bold tracking-widest uppercase">צור קשר</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:052-341-0467" className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-all duration-200 text-sm group bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/30 rounded-xl px-5 py-3">
                <Phone className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors shrink-0" strokeWidth={1.5} />
                <span dir="ltr">052-341-0467</span>
              </a>
              <a href="mailto:info@kohelet.digital" className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-all duration-200 text-sm group bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/30 rounded-xl px-5 py-3">
                <Mail className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors shrink-0" strokeWidth={1.5} />
                <span dir="ltr">info@kohelet.digital</span>
              </a>
              <a href="https://instagram.com/kohelet.digital" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-all duration-200 text-sm group bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/30 rounded-xl px-5 py-3">
                <svg className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                <span dir="ltr">@kohelet.digital</span>
              </a>
              <a href="/he" className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-all duration-200 text-sm group bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/30 rounded-xl px-5 py-3">
                <svg className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                <span dir="ltr">kohelet.digital</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800/40">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-zinc-700 text-xs">{footerContent.copyright}</p>
            <a href="/he"><img src="/logo-horizontal-white-digital.svg" alt="Kohelet Digital" className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
