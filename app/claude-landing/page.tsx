import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { Nav } from "@/components/claude-landing/Nav";
import { Reveal } from "@/components/claude-landing/Reveal";
import { ValueLoop } from "@/components/claude-landing/ValueLoop";
import { ContactForm } from "@/components/claude-landing/ContactForm";
import {
  contact,
  faq,
  footer,
  hero,
  loop,
  process,
  services,
  work,
} from "@/components/claude-landing/content";

export default function ClaudeLandingPage() {
  return (
    <div data-page="claude-landing" id="top">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Nav />

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
          <div className="cl-grid-bg" aria-hidden="true" />
          <div className="cl-glow" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <p className="cl-eyebrow cl-rise" style={{ "--delay": "0ms" } as React.CSSProperties}>
              {hero.eyebrow}
            </p>
            <h1
              className="cl-display cl-rise mt-7 text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              style={{ "--delay": "80ms" } as React.CSSProperties}
            >
              {hero.headline[0]}
              <br />
              <span style={{ color: "var(--cl-ink-2)" }}>{hero.headline[1]}</span>
            </h1>
            <p
              className="cl-lede cl-rise mt-8 max-w-xl text-lg leading-relaxed sm:text-xl"
              style={{ "--delay": "160ms" } as React.CSSProperties}
            >
              {hero.lede}
            </p>
            <div
              className="cl-rise mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              style={{ "--delay": "240ms" } as React.CSSProperties}
            >
              <a href={hero.primaryCta.href} className="cl-btn cl-btn-primary">
                {hero.primaryCta.label}
                <ArrowRight className="cl-arrow h-4 w-4" aria-hidden="true" />
              </a>
              <a href={hero.secondaryCta.href} className="cl-btn cl-btn-secondary">
                {hero.secondaryCta.label}
              </a>
            </div>
            <p
              className="cl-rise mt-5 text-sm"
              style={{ color: "var(--cl-ink-3)", "--delay": "320ms" } as React.CSSProperties}
            >
              {hero.note}
            </p>
          </div>
        </section>

        {/* ── Value loop ───────────────────────────────────────────────── */}
        <section
          id="loop"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="loop-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="cl-eyebrow">{loop.eyebrow}</p>
              <h2 id="loop-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                {loop.heading}
              </h2>
              <p className="cl-lede mt-5 text-base sm:text-lg">{loop.intro}</p>
            </Reveal>
            <Reveal className="mt-14 md:mt-16" delay={120}>
              <ValueLoop />
            </Reveal>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section
          id="services"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="services-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="cl-eyebrow">What we do</p>
              <h2 id="services-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                Three services. One aim: useful outcomes.
              </h2>
              <p className="cl-lede mt-5 text-base sm:text-lg">
                Each starts from a business problem, not a technology. Here is what we
                do about it, and what it should change for you.
              </p>
            </Reveal>

            <div className="mt-16 space-y-0">
              {services.map((s, i) => (
                <Reveal
                  key={s.id}
                  as="article"
                  id={s.id}
                  className="cl-service scroll-mt-24 grid gap-8 py-14 md:grid-cols-12 md:gap-10 md:py-20"
                  delay={i === 0 ? 0 : 60}
                >
                  <div className="md:col-span-5">
                    <span className="cl-service-index">{s.index}</span>
                    <h3 className="cl-h2 mt-4 text-2xl sm:text-3xl md:text-[2.1rem]">
                      {s.name}
                    </h3>
                    <p className="mt-4 text-lg" style={{ color: "var(--cl-ink-2)" }}>
                      {s.short}
                    </p>
                  </div>
                  <div className="space-y-10 md:col-span-7 md:pt-2">
                    <div className="cl-facet">
                      <p className="cl-facet-label">The problem</p>
                      <p className="cl-lede mt-2 text-[15px] leading-relaxed sm:text-base">
                        {s.problem}
                      </p>
                    </div>
                    <div className="cl-facet">
                      <p className="cl-facet-label">What Kohelet does</p>
                      <p className="mt-2 text-[15px] sm:text-base">{s.work.intro}</p>
                      <ul className="cl-list mt-3 space-y-2 text-[15px] sm:text-base">
                        {s.work.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="cl-facet">
                      <p className="cl-facet-label">What it changes</p>
                      <p className="mt-2 text-[15px] leading-relaxed sm:text-base">
                        {s.benefit}
                      </p>
                      {s.honesty && (
                        <p className="cl-note mt-4 text-sm leading-relaxed">{s.honesty}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────────────── */}
        <section
          id="process"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="process-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="cl-eyebrow">{process.eyebrow}</p>
              <h2 id="process-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                {process.heading}
              </h2>
            </Reveal>
            <Reveal as="ol" className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {process.steps.map((step, i) => (
                <li key={step.name} className="cl-step">
                  <div
                    className="cl-step-line mb-6"
                    style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
                  />
                  <span className="cl-step-num">0{i + 1}</span>
                  <h3 className="cl-h2 mt-3 text-2xl">{step.name}</h3>
                  <p className="cl-lede mt-3 text-[15px] leading-relaxed">{step.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Work ─────────────────────────────────────────────────────── */}
        <section
          id="work"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="work-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="cl-eyebrow">{work.eyebrow}</p>
                <h2 id="work-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                  {work.heading}
                </h2>
                <p className="cl-lede mt-5 text-base sm:text-lg">{work.intro}</p>
              </div>
              <Link href="/en/portfolio" className="cl-link inline-flex items-center gap-1.5 text-sm">
                Full portfolio
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {work.projects.map((p, i) => (
                <Reveal as="li" key={p.title} delay={(i % 2) * 80}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cl-work-card group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={`Screenshot of ${p.title}`}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4 p-5">
                      <div>
                        <p className="cl-facet-label">{p.category}</p>
                        <h3 className="mt-1.5 text-lg font-medium tracking-tight">{p.title}</h3>
                        <p className="cl-lede mt-1.5 text-sm leading-relaxed">{p.description}</p>
                      </div>
                      <ArrowUpRight
                        className="mt-1 h-4 w-4 flex-none"
                        style={{ color: "var(--cl-ink-3)" }}
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section
          id="faq"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <p className="cl-eyebrow">{faq.eyebrow}</p>
              <h2 id="faq-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                {faq.heading}
              </h2>
            </Reveal>
            <Reveal className="cl-faq md:col-span-7" delay={80}>
              {faq.items.map((item) => (
                <details key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="cl-chevron" aria-hidden="true">
                      <Plus className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="cl-faq-body text-[15px] leading-relaxed sm:text-base">{item.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section
          id="contact"
          className="scroll-mt-20 border-t cl-rule py-20 sm:py-28"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="cl-eyebrow">{contact.eyebrow}</p>
              <h2 id="contact-heading" className="cl-h2 mt-5 text-3xl sm:text-4xl md:text-5xl">
                {contact.heading}
              </h2>
              <p className="cl-lede mt-5 text-base sm:text-lg">{contact.body}</p>
              <ul className="mt-10 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4" style={{ color: "var(--cl-accent-ink)" }} aria-hidden="true" />
                  <a href={`mailto:${contact.email}`} className="cl-link">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4" style={{ color: "var(--cl-accent-ink)" }} aria-hidden="true" />
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="cl-link">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" style={{ color: "var(--cl-accent-ink)" }} aria-hidden="true" />
                  <span style={{ color: "var(--cl-ink-2)" }}>{contact.location}</span>
                </li>
              </ul>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t cl-rule py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-horizontal-white-digital.svg"
              alt="Kohelet Digital"
              width={82}
              height={40}
            />
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {footer.links.map((l) => (
              <Link key={l.href} href={l.href} className="cl-link">
                {l.label}
              </Link>
            ))}
            {footer.social.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cl-link"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-xs" style={{ color: "var(--cl-ink-3)" }}>
            {footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
