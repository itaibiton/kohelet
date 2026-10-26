import { getLanding } from "@/content/landing";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Intro, Solutions, Pillars, Outcomes, Founder, Footer } from "@/components/landing/Sections";
import { Contact } from "@/components/landing/Contact";
import { RevealObserver } from "@/components/landing/RevealObserver";
import { getProfessionalServiceSchema, jsonLdScriptProps } from "@/lib/schema";
import "@/components/landing/landing.css";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getLanding(locale);

  return (
    <main className="kd relative">
      <script
        {...jsonLdScriptProps(
          getProfessionalServiceSchema(
            locale,
            t.solutions.services.map((s) => ({ name: s.title, description: s.description }))
          )
        )}
      />
      <Header brand={t.brand} nav={t.nav} />
      <Hero brand={t.brand} hero={t.hero} />
      <Intro intro={t.intro} />
      <hr className="kd-rule" />
      <Solutions solutions={t.solutions} />
      <Pillars pillars={t.pillars} />
      <Outcomes outcomes={t.outcomes} />
      <hr className="kd-rule" />
      <Founder founder={t.founder} />
      <hr className="kd-rule" />
      <Contact contact={t.contact} />
      <Footer brand={t.brand} footer={t.footer} nav={t.nav} localeHref={`/${locale}`} />
      <RevealObserver />
    </main>
  );
}
