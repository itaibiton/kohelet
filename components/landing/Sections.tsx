import Image from "next/image";
import { Brain, Zap, Users, BarChart3 } from "lucide-react";
import type { LandingContent, Pillar } from "@/content/landing";

/* Shared bits ------------------------------------------------------------ */

function SectionHead({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-12 md:mb-20" data-reveal>
      <p className="kd-kicker mb-4">{kicker}</p>
      <h2 id={id} className="kd-title">
        {title}
      </h2>
    </div>
  );
}

const PILLAR_ICONS: Record<Pillar["icon"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  brain: Brain,
  zap: Zap,
  users: Users,
  chart: BarChart3,
};

/* 1. Intro --------------------------------------------------------------- */

export function Intro({ intro }: { intro: LandingContent["intro"] }) {
  return (
    <section className="kd-section" aria-labelledby="intro-heading">
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <p className="kd-kicker md:col-span-2" data-reveal>
          {intro.kicker}
        </p>
        <div className="md:col-span-10">
          <h2 id="intro-heading" className="kd-display text-[clamp(2.5rem,7vw,6.5rem)]" data-reveal>
            {intro.heading}
          </h2>
          <p
            className="kd-lead mt-8 md:mt-12"
            data-reveal
            style={{ "--kd-reveal-delay": "120ms" } as React.CSSProperties}
          >
            {intro.body}
          </p>
        </div>
      </div>
    </section>
  );
}

/* 2. Solutions ----------------------------------------------------------- */

export function Solutions({ solutions }: { solutions: LandingContent["solutions"] }) {
  return (
    <section id="services" className="kd-section" aria-labelledby="services-heading">
      <SectionHead kicker={solutions.kicker} title={solutions.title} id="services-heading" />
      <ol className="list-none">
        {solutions.services.map((service, i) => (
          <li
            key={service.title}
            className="kd-service"
            data-reveal
            style={{ "--kd-reveal-delay": `${i * 60}ms` } as React.CSSProperties}
          >
            <span className="kd-service-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{service.title}</h3>
            <p className="text-[var(--kd-mute)] md:col-start-3 md:max-w-[40ch]">{service.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 3. Pillars (icon cards) ------------------------------------------------ */

export function Pillars({ pillars }: { pillars: LandingContent["pillars"] }) {
  return (
    <section id="approach" className="kd-section" aria-labelledby="approach-heading">
      <SectionHead kicker={pillars.kicker} title={pillars.title} id="approach-heading" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {pillars.items.map((item, i) => {
          const Icon = PILLAR_ICONS[item.icon];
          return (
            <li
              key={item.title}
              className="kd-card"
              data-reveal
              style={{ "--kd-reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <div className="kd-icon mb-8">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-3 text-xl font-black tracking-tight md:text-2xl">{item.title}</h3>
              <p className="text-[var(--kd-mute)]">{item.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 4. Outcomes (text cards) ----------------------------------------------- */

export function Outcomes({ outcomes }: { outcomes: LandingContent["outcomes"] }) {
  return (
    <section id="outcomes" className="kd-section" aria-labelledby="outcomes-heading">
      <SectionHead kicker={outcomes.kicker} title={outcomes.title} id="outcomes-heading" />
      <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {outcomes.items.map((item, i) => (
          <li
            key={item.title}
            className="kd-outcome"
            data-reveal
            style={{ "--kd-reveal-delay": `${i * 80}ms` } as React.CSSProperties}
          >
            <span className="text-sm font-extrabold tracking-[0.08em] opacity-60" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="mb-3">{item.title}</h3>
              <p className="max-w-[46ch] opacity-80">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 5. Founder ------------------------------------------------------------- */

export function Founder({ founder }: { founder: LandingContent["founder"] }) {
  const isTodo = founder.personal.startsWith("TODO");
  return (
    <section id="founder" className="kd-section" aria-labelledby="founder-heading">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12 lg:items-center">
        <div className="md:col-span-5 lg:col-span-4" data-reveal>
          <figure className="kd-portrait">
            {/* TODO: add /public/images/itai-biton.jpg (4:5 portrait) and swap the placeholder for:
                <Image src="/images/itai-biton.jpg" alt={founder.photoAlt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" /> */}
            <div className="kd-portrait-placeholder" role="img" aria-label={founder.photoAlt}>
              <span aria-hidden="true">{founder.name.split(" ").map((w) => w[0]).join("")}</span>
            </div>
          </figure>
        </div>
        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <p className="kd-kicker mb-4" data-reveal>
            {founder.kicker}
          </p>
          <h2 id="founder-heading" className="kd-title mb-6" data-reveal>
            {founder.title}
          </h2>
          <p className="text-lg font-extrabold tracking-tight md:text-xl" data-reveal>
            {founder.name}
            <span className="font-normal text-[var(--kd-mute)]"> · {founder.role}</span>
          </p>
          <p className="kd-lead mt-6" data-reveal>
            {founder.bio}
          </p>
          <p
            className={`mt-6 max-w-[44ch] font-bold ${
              isTodo ? "rounded-lg border border-dashed border-[var(--kd-blue)] px-3 py-2 text-[var(--kd-blue)]" : ""
            }`}
            data-reveal
          >
            {founder.personal}
          </p>
        </div>
      </div>
    </section>
  );
}

/* 7. Footer -------------------------------------------------------------- */

export function Footer({
  brand,
  footer,
  nav,
  localeHref,
}: {
  brand: LandingContent["brand"];
  footer: LandingContent["footer"];
  nav: LandingContent["nav"];
  localeHref: string;
}) {
  return (
    <footer className="kd-section kd-section--tight on-dark bg-[var(--kd-dark)] text-[var(--kd-ivory)]">
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-black tracking-tight md:text-5xl">
            {brand.name}
            <span className="text-[var(--kd-blue)]" aria-hidden="true">
              .
            </span>
          </p>
          <p className="mt-3 text-sm opacity-70 md:text-base">{brand.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
              {link.label}
            </a>
          ))}
          {footer.links.map((link) => (
            <a
              key={link.href}
              href={link.href.startsWith("/") ? localeHref + link.href : link.href}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mt-12 text-xs opacity-50">{footer.copyright}</p>
    </footer>
  );
}

/* Mascot image used in the contact section ------------------------------ */

export function Mascot({ alt, className }: { alt: string; className?: string }) {
  return (
    <Image
      src="/images/robot-king.png"
      alt={alt}
      width={512}
      height={512}
      sizes="(min-width: 1024px) 20vw, 50vw"
      className={className}
    />
  );
}
