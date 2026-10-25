import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Compass, Network, Plus, Search } from "lucide-react";
import ContactForm from "./ContactForm";
import LanguageMenu from "./LanguageMenu";
import RobotKing from "./RobotKing";
import { landingCopy, type LandingLocale } from "./landing-copy";

const serviceIcons = [Search, Network, Compass];
// Restore after the current examples are replaced with relevant use cases.
const showSelectedWork = false;

export default function Landing({ locale = "en" }: { locale?: LandingLocale }) {
  const copy = landingCopy[locale];
  return (
    <div className="kl-page" id="top" dir={locale === "he" ? "rtl" : "ltr"} lang={locale} data-locale={locale}>
      <a href="#main-content" className="kl-skip-link">{copy.skip}</a>
      <header className="kl-header kl-container">
        <a href="#top" className="kl-brand" aria-label={copy.backToTopLabel}>
          <Image src="/logo-horizontal-no-digital.svg" alt={copy.brand} width={108} height={44} priority />
        </a>
        <nav className="kl-nav" aria-label={copy.navigationLabel}>
          <a href="#services">{copy.navigation.services}</a>
          <a href="#approach">{copy.navigation.approach}</a>
          {showSelectedWork && <a href="#work">{copy.navigation.work}</a>}
        </nav>
        <div className="kl-header-actions">
          <a href="#contact" className="kl-nav-contact">{copy.contactShort}<ArrowUpRight size={17} /></a>
          <LanguageMenu locale={locale} label={copy.languageSwitchLabel} />
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="kl-hero kl-container" aria-labelledby="kl-hero-title">
          <div className="kl-hero-copy">
            <div className="kl-eyebrow"><span className="kl-square" />{copy.hero.eyebrow}</div>
            <h1 id="kl-hero-title">{copy.hero.title[0]}<br />{copy.hero.title[1]}<br /><em>{copy.hero.title[2]}</em></h1>
            <p className="kl-hero-description">{copy.hero.description[0]}<br className="kl-desktop-break" />{" "}{copy.hero.description[1]}</p>
            <div className="kl-hero-actions">
              <a className="kl-button kl-button-primary" href="#contact">{copy.hero.cta}<ArrowUpRight size={18} /></a>
              <a className="kl-text-link" href="#services">{copy.hero.explore}<ArrowDown size={15} /></a>
            </div>
            <div className="kl-hero-note"><span />{copy.hero.note}</div>
          </div>
          <RobotKing label={copy.hero.imageAlt} />
        </section>

        <div className="kl-intro-strip kl-container">
          <p>{copy.strip.title[0]}<br /><span>{copy.strip.title[1]}</span></p>
          {copy.strip.benefits.map((benefit, index) => {
            const Icon = serviceIcons[index];
            return <div key={benefit}><Icon size={18} /><span>{benefit}</span></div>;
          })}
        </div>

        <section className="kl-services kl-container kl-section" id="services" aria-labelledby="kl-services-title">
          <div className="kl-section-heading">
            <div className="kl-eyebrow"><span className="kl-square" />{copy.services.eyebrow}</div>
            <div><h2 id="kl-services-title">{copy.services.title[0]}<br /><em>{copy.services.title[1]}</em></h2><p>{copy.services.description[0]}<br className="kl-desktop-break" />{" "}{copy.services.description[1]}</p></div>
          </div>
          <div className="kl-service-list">
            {copy.services.items.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <article className="kl-service" key={service.number}>
                  <div className="kl-service-number"><bdi dir="ltr">{service.number}</bdi><span><Icon size={24} strokeWidth={1.5} /></span></div>
                  <div className="kl-service-title"><p className="kl-label">{service.eyebrow}</p><h3>{service.title[0]}<br />{service.title[1]}</h3></div>
                  <div className="kl-service-copy"><h4>{service.problem}</h4><p>{service.description}</p><ul className="kl-tags" aria-label={copy.services.areasLabel}>{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><p className="kl-service-outcome"><ArrowRight size={16} />{service.outcome}</p></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="kl-approach" id="approach" aria-labelledby="kl-approach-title">
          <div className="kl-container">
            <div className="kl-approach-heading"><div><div className="kl-eyebrow"><span className="kl-square" />{copy.approach.eyebrow}</div><h2 id="kl-approach-title">{copy.approach.title[0]}<br /><em>{copy.approach.title[1]}</em></h2></div><p>{copy.approach.description[0]}<br />{copy.approach.description[1]}<br className="kl-desktop-break" />{" "}{copy.approach.description[2]}</p></div>
            <ol className="kl-process">{copy.approach.steps.map((step) => <li key={step.number}><div className="kl-process-track"><bdi dir="ltr">{step.number}</bdi><ArrowRight size={20} strokeWidth={1.3} /></div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
            <div className="kl-approach-foot"><Check size={15} />{copy.approach.foot}</div>
          </div>
        </section>

        {showSelectedWork && (
          <section className="kl-work kl-container kl-section" id="work" aria-labelledby="kl-work-title">
            <div className="kl-work-heading"><div><div className="kl-eyebrow"><span className="kl-square" />{copy.work.eyebrow}</div><h2 id="kl-work-title">{copy.work.title[0]} <em>{copy.work.title[1]}</em></h2></div><p>{copy.work.description[0]}<br />{copy.work.description[1]}</p></div>
            <div className="kl-projects">
              {copy.work.projects.map((project) => <a className="kl-project" key={project.key} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={project.visitLabel}>
                <div className={`kl-project-image kl-project-image-${project.key}`}><div className="kl-project-browser"><div className="kl-browser-bar"><span /><span /><span /><p dir="ltr">{project.domain}</p></div><Image src={project.image} alt={project.alt} width={1265} height={project.height} sizes="(max-width: 700px) 90vw, 45vw" /></div><span className="kl-project-visit"><ArrowUpRight size={21} /></span></div>
                <div className="kl-project-caption"><div><h3>{project.title}</h3><p>{project.description}</p></div><span>{project.category}</span></div>
              </a>)}
            </div>
          </section>
        )}

        <section className="kl-faq kl-container kl-section" aria-labelledby="kl-faq-title">
          <div><div className="kl-eyebrow"><span className="kl-square" />{copy.faq.eyebrow}</div><h2 id="kl-faq-title">{copy.faq.title[0]}<br /><em>{copy.faq.title[1]}</em></h2><p>{copy.faq.description[0]}<br className="kl-desktop-break" />{" "}{copy.faq.description[1]}</p></div>
          <div className="kl-faq-list">{copy.faq.questions.map((item) => <details key={item.number} className="kl-faq-item"><summary><bdi className="kl-faq-number" dir="ltr">{item.number}</bdi><span>{item.question}</span><Plus size={18} strokeWidth={1.5} /></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="kl-contact" id="contact" aria-labelledby="kl-contact-title">
          <div className="kl-container kl-contact-grid"><div className="kl-contact-copy"><div className="kl-eyebrow"><span className="kl-square" />{copy.contact.eyebrow}</div><h2 id="kl-contact-title">{copy.contact.title[0]}<br /><em>{copy.contact.title[1]}</em></h2><p>{copy.contact.description[0]}<br className="kl-desktop-break" />{" "}{copy.contact.description[1]}<br />{copy.contact.description[2]}</p><a href={`mailto:${copy.contact.email}`} className="kl-contact-email"><bdi dir="ltr">{copy.contact.email}</bdi><ArrowUpRight size={18} /></a><div className="kl-contact-mark" aria-hidden="true"><svg viewBox="0 0 120 120" fill="none"><path d="M22 95 95 22M22 22h73v73" stroke="currentColor" strokeWidth="1.5" /><path d="M6 79 79 6M41 114l73-73" stroke="currentColor" strokeWidth="1" opacity=".3" /></svg></div></div><ContactForm locale={locale} /></div>
        </section>
      </main>

      <footer className="kl-footer kl-container"><a className="kl-footer-brand" href="#top" aria-label={copy.backToTopLabel}><Image src="/logo-horizontal-no-digital.svg" alt={copy.brand} width={100} height={41} /><span>{copy.footer.tagline[0]}<br />{copy.footer.tagline[1]}</span></a><p>© <bdi>{new Date().getFullYear()}</bdi> {copy.footer.brand}</p><a href="#top" className="kl-text-link">{copy.footer.backToTop}<ArrowUpRight size={15} /></a></footer>
    </div>
  );
}
