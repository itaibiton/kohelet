"use client";

import { useState, useRef, useCallback } from "react";
// videoEnded state removed — ping-pong video handles looping natively
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
import CountUp from "@/components/777/CountUp";
import TestimonialsSection from "@/components/777/TestimonialsSection";

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

  const handleVideoEnd = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Intro ended — switch to ping-pong loop
    video.src = "/777/video-pingpong.mp4";
    video.loop = true;
    video.play();
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

      {/* Floating nav — same style as main kohelet site */}
      <nav className="fixed top-6 left-0 w-full flex justify-center px-4 pointer-events-none" style={{ zIndex: 60 }}>
        <div
          className="pointer-events-auto px-6 py-3 rounded-full flex justify-between items-center gap-8 md:gap-12"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(251,191,36,0.15)",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <a href="/he" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo-vertical-no-digital.svg" alt="Kohelet Digital" width={32} height={32} />
          </a>

          {/* Nav links — desktop */}
          <ul className="hidden md:flex items-center gap-6">
            <li><button onClick={scrollToForm} className="text-[11px] font-medium cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>צור קשר</button></li>
            <li><a href="/he" className="text-[11px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>אתר ראשי</a></li>
            <li><a href="https://instagram.com/kohelet.digital" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>אינסטגרם</a></li>
          </ul>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            className="flex items-center gap-2 text-[10px] font-bold rounded-full transition-all cursor-pointer hover:brightness-110"
            style={{
              background: "linear-gradient(to left, #f59e0b, #facc15)",
              color: "#000",
              padding: "0.5rem 1.25rem",
              boxShadow: "0 0 15px rgba(251,191,36,0.3)",
            }}
          >
            {heroContent.ctaButton}
          </button>
        </div>
      </nav>

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          poster="/777/poster.jpg"
          src="/777/video.mp4"
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover object-[30%_center] sm:object-center"
          style={{ zIndex: 0 }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1 }} />

        {/* Subtle gold radial glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(251,191,36,0.10), transparent)", zIndex: 2 }} />

        {/* Content */}
        <div className="relative w-full" style={{ padding: "0 1.5rem", zIndex: 10 }}>
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
              style={{ animationDelay: "0.5s", color: "#fbbf24", marginBottom: "1.5rem", fontWeight: 900, textShadow: "0 0 20px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)" }}
            >
              דף נחיתה בזק: <CountUp to={777} duration={0.6} separator="," className="inline" /> ₪. <CountUp to={7} duration={0.4} className="inline" /> ימי עסקים. בול!
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

        {/* Watermark cover — bottom right, hidden on mobile */}
        <div className="absolute pointer-events-none watermark-blob" style={{ bottom: 0, right: 0, width: "13rem", height: "7rem", backgroundColor: "#000000", zIndex: 15 }} />

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
      <TestimonialsSection />

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#09090b" }}>
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

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/972523410467?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%9C%D7%AA%20777%20%E2%82%AA"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שלח הודעה בוואטסאפ"
        className="fixed transition-transform duration-300 hover:scale-110"
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "32px", height: "32px" }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
