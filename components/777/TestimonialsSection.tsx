"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

/* ------------------------------------------------------------------ */
/*  Five curated testimonials for the Casino Gold theme                */
/* ------------------------------------------------------------------ */
const testimonialData: Testimonial[] = [
  {
    name: "משה",
    role: "פנטהאוז יוקרה להתארגנות כלה",
    text: "תוך שבוע קיבלתי דף נחיתה מושלם. כבר ביום הראשון התחלתי לקבל לידים. שווה כל שקל!",
    avatar: "מ",
  },
  {
    name: "רונית שמש",
    role: "יועצת עסקית",
    text: "המחיר הזה לא מתחרה. קיבלתי דף ברמה גבוהה מאוד במחיר שלא האמנתי שאפשרי.",
    avatar: "ר",
  },
  {
    name: "טלי",
    role: "מאמנת התפתחות אישית",
    text: "עברנו מאפס נוכחות דיגיטלית לדף שממיר. המהירות והמקצועיות היו מעל ומעבר.",
    avatar: "י",
  },
  {
    name: "גיל ברק",
    role: "סוכן ביטוח",
    text: "כל הלידים שלי מגיעים מהדף. ההשקעה הכי טובה שעשיתי לעסק השנה.",
    avatar: "ג",
  },
  {
    name: "שירה מזרחי",
    role: "מטפלת הוליסטית",
    text: "הדף הביא לי 20 לקוחות חדשים בחודש הראשון. לא חלמתי על תוצאות כאלה.",
    avatar: "ש",
  },
  {
    name: "נועה פרידמן",
    role: "מעצבת גרפית",
    text: "לא האמנתי שאפשר לקבל דף כל כך יפה במחיר הזה. הלקוחות שלי מתלהבים!",
    avatar: "נ",
  },
];

/* ------------------------------------------------------------------ */
/*  Per-card layout offsets (desktop asymmetric stagger)               */
/* ------------------------------------------------------------------ */
const cardLayouts = [
  { gridCol: "1 / 2", gridRow: "1 / 2", translateY: 0, rotate: -0.6, scale: 1 },
  { gridCol: "2 / 3", gridRow: "1 / 2", translateY: 12, rotate: 0.4, scale: 1 },
  { gridCol: "3 / 4", gridRow: "1 / 2", translateY: -8, rotate: -0.3, scale: 1 },
  { gridCol: "1 / 2", gridRow: "2 / 3", translateY: 8, rotate: 0.5, scale: 1 },
  { gridCol: "2 / 3", gridRow: "2 / 3", translateY: -6, rotate: -0.4, scale: 1 },
  { gridCol: "3 / 4", gridRow: "2 / 3", translateY: 10, rotate: 0.3, scale: 1 },
];

/* ------------------------------------------------------------------ */
/*  Animated star component                                           */
/* ------------------------------------------------------------------ */
function GoldStars({ delay }: { delay: number }) {
  return (
    <div className="flex gap-1" style={{ direction: "ltr" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          style={{
            width: 16,
            height: 16,
            fill: "#fbbf24",
            filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))",
            opacity: 0,
            animation: `starPop 0.4s ease-out ${delay + i * 0.08}s forwards`,
          }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated decorative quote mark                                    */
/* ------------------------------------------------------------------ */
function FloatingQuote({ side, idx }: { side: "open" | "close"; idx: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top: side === "open" ? -6 : undefined,
        bottom: side === "close" ? -2 : undefined,
        right: side === "open" ? 12 : undefined,
        left: side === "close" ? 12 : undefined,
        fontSize: 56,
        fontFamily: "Georgia, serif",
        lineHeight: 1,
        color: "transparent",
        backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        opacity: 0.25,
        pointerEvents: "none",
        userSelect: "none",
        animation: `quoteFloat 6s ease-in-out ${idx * 0.7}s infinite alternate`,
      }}
    >
      {side === "open" ? "\u201D" : "\u201C"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Single testimonial card                                           */
/* ------------------------------------------------------------------ */
function TestimonialCard({
  t,
  layout,
  idx,
}: {
  t: Testimonial;
  layout: (typeof cardLayouts)[0];
  idx: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="testimonial-card relative flex flex-col"
      style={{
        /* Grid placement — desktop only, overridden on mobile via class */
        gridColumn: layout.gridCol,
        gridRow: layout.gridRow,
        /* Glass card */
        background: hovered
          ? "linear-gradient(145deg, rgba(251,191,36,0.08) 0%, rgba(24,24,27,0.95) 50%, rgba(9,9,11,0.98) 100%)"
          : "linear-gradient(145deg, rgba(251,191,36,0.04) 0%, rgba(24,24,27,0.92) 50%, rgba(9,9,11,0.97) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: hovered
          ? "1px solid rgba(251,191,36,0.35)"
          : "1px solid rgba(251,191,36,0.12)",
        borderRadius: 20,
        padding: "28px 24px 24px",
        boxShadow: hovered
          ? "0 0 40px rgba(251,191,36,0.12), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,191,36,0.15)"
          : "0 0 20px rgba(251,191,36,0.04), 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,191,36,0.08)",
        transform: `translateY(${layout.translateY}px) rotate(${layout.rotate}deg) scale(${layout.scale})`,
        transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        opacity: 0,
        animation: `cardReveal 0.7s ease-out ${0.15 + idx * 0.12}s forwards`,
        willChange: "transform, opacity, box-shadow",
      }}
    >
      {/* Ambient glow behind card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(251,191,36,0.15), transparent 60%)",
          opacity: hovered ? 0.6 : 0,
          transition: "opacity 0.5s ease",
          zIndex: -1,
          filter: "blur(20px)",
        }}
      />

      {/* Decorative quote marks */}
      <FloatingQuote side="open" idx={idx} />

      {/* Stars */}
      <GoldStars delay={0.4 + idx * 0.12} />

      {/* Quote text */}
      <blockquote
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "rgba(228,228,231,0.9)",
          margin: "16px 0 20px",
          flex: 1,
          position: "relative",
        }}
      >
        {t.text}
      </blockquote>

      <FloatingQuote side="close" idx={idx} />

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(to left, transparent, rgba(251,191,36,0.25), transparent)",
          marginBottom: 16,
        }}
      />

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar circle with amber gradient */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #d97706, #b45309)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#09090b",
            boxShadow: "0 0 16px rgba(245,158,11,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
            flexShrink: 0,
            animation: `avatarGlow 4s ease-in-out ${idx * 0.5}s infinite alternate`,
          }}
        >
          {t.avatar}
        </div>
        <div>
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#fafafa",
              marginBottom: 2,
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "rgba(161,161,170,0.8)",
            }}
          >
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN SECTION EXPORT                                               */
/* ================================================================== */
export default function TestimonialsSection({
  testimonials = testimonialData,
}: {
  testimonials?: Testimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = testimonials.slice(0, 6);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{
        background: "linear-gradient(180deg, #09090b 0%, #0c0a09 50%, #09090b 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "96px 24px 112px",
      }}
    >
      {/* ---------- Keyframe animations ---------- */}
      <style>{`
        @keyframes cardReveal {
          from {
            opacity: 0;
            transform: translateY(40px) rotate(0deg) scale(0.92);
          }
          to {
            opacity: 1;
          }
        }

        @keyframes starPop {
          from { opacity: 0; transform: scale(0) rotate(-45deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes quoteFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }

        @keyframes avatarGlow {
          from { box-shadow: 0 0 16px rgba(245,158,11,0.3), inset 0 -2px 4px rgba(0,0,0,0.2); }
          to   { box-shadow: 0 0 24px rgba(251,191,36,0.45), inset 0 -2px 4px rgba(0,0,0,0.2); }
        }

        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.1); }
          66%  { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-50px, 50px) scale(1.08); }
          66%  { transform: translate(40px, -20px) scale(0.97); }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, 40px) scale(1.05); }
        }

        @keyframes headlineShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes lineExpand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes badgeFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---- Responsive: flatten on mobile ---- */
        @media (max-width: 767px) {
          .testimonials-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
            align-items: stretch !important;
          }
          .testimonial-card {
            transform: none !important;
            grid-column: unset !important;
            grid-row: unset !important;
          }
        }

        /* ---- Reduced motion ---- */
        @media (prefers-reduced-motion: reduce) {
          .testimonial-card,
          .testimonial-card * {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ---------- Atmospheric orbs ---------- */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -120,
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbDrift1 20s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -80,
          left: "5%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orbDrift2 25s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "orbDrift3 18s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ---------- Noise texture overlay ---------- */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          pointerEvents: "none",
        }}
      />

      {/* ---------- Section header ---------- */}
      <div
        className="relative"
        style={{
          maxWidth: 800,
          margin: "0 auto 72px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(251,191,36,0.08)",
            border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 24,
            animation: visible ? "badgeFadeIn 0.6s ease-out forwards" : "none",
            opacity: visible ? undefined : 0,
          }}
        >
          <span style={{ fontSize: 14, color: "#fbbf24", fontWeight: 500 }}>
            הלקוחות שלנו מספרים
          </span>
          <svg
            viewBox="0 0 20 20"
            style={{ width: 14, height: 14, fill: "#fbbf24" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Headline with gold shimmer */}
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            lineHeight: 1.2,
            backgroundImage:
              "linear-gradient(90deg, #fbbf24 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 75%, #fbbf24 100%)",
            backgroundSize: "200% auto",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: visible
              ? "headlineShimmer 6s linear infinite"
              : "none",
            marginBottom: 16,
          }}
        >
          ביחד, אנחנו בונים הצלחה
        </h2>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(161,161,170,0.7)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          מאות בעלי עסקים כבר קיבלו דף נחיתה שעובד. הנה מה שהם אומרים.
        </p>

      </div>

      {/* ---------- Testimonials grid ---------- */}
      <div
        className="testimonials-grid relative"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto auto",
          gap: "32px",
          alignItems: "start",
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {items.map((t, i) => (
          <TestimonialCard
            key={i}
            t={t}
            layout={cardLayouts[i]}
            idx={i}
          />
        ))}
      </div>

    </section>
  );
}
