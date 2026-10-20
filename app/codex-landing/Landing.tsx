"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  MoveUpRight,
  Network,
  Plus,
  Search,
} from "lucide-react";
import ContactForm from "./ContactForm";

const pathways = [
  {
    number: "01",
    label: "Visibility",
    title: "Be found.",
    subtitle: "Show up where customers look.",
    description: "Build a clearer, more discoverable presence across search engines and AI-powered answers.",
    icon: Search,
  },
  {
    number: "02",
    label: "Connected workflows",
    title: "Free up the work.",
    subtitle: "Let your tools work together.",
    description: "Connect everyday processes so your team can spend less time on repetitive tasks.",
    icon: Network,
  },
  {
    number: "03",
    label: "Clear decisions",
    title: "Move with clarity.",
    subtitle: "Know what to do next.",
    description: "Turn a world of AI options into a practical plan that fits your people and your business.",
    icon: Compass,
  },
];

const services = [
  {
    number: "01",
    eyebrow: "AI SEO & AI SEARCH OPTIMIZATION",
    title: <>Get discovered.<br />Be understood.</>,
    problem: "Great work deserves to be found.",
    description: "Your customers are searching in new ways. We make your website easier for search engines and AI systems to understand, with useful content and a strong technical foundation.",
    tags: ["Technical SEO", "Content structure", "Structured data", "AI search visibility"],
    outcome: "A clearer path from a customer’s question to your business.",
    icon: Search,
  },
  {
    number: "02",
    eyebrow: "AI IMPLEMENTATION & AUTOMATION",
    title: <>Less busywork.<br />More possibility.</>,
    problem: "Your team’s time is too valuable for copy-paste.",
    description: "We find the handoffs and repeat tasks that slow you down, then build practical AI workflows around the way you work. The right solution should make the day simpler.",
    tags: ["AI assistants", "Knowledge workflows", "Lead handling", "CRM connections"],
    outcome: "More time for the work that needs a human.",
    icon: Network,
  },
  {
    number: "03",
    eyebrow: "AI CONSULTING & TEAM TRAINING",
    title: <>A clear plan.<br />A confident team.</>,
    problem: "You don’t need another list of AI tools.",
    description: "You need to know what’s useful for your business. We help you assess the opportunities, choose where to start, and give your team the skills to put the plan into practice.",
    tags: ["Opportunity discovery", "Tool evaluation", "Practical roadmaps", "Team enablement"],
    outcome: "Better decisions about where AI belongs in your business.",
    icon: Compass,
  },
];

const process = [
  { title: "Discover", text: "We listen first. Your goals, your team, and the work that gets in the way." },
  { title: "Prioritize", text: "We choose a useful starting point, with a clear scope and a reason to do it." },
  { title: "Implement", text: "We build, test, and refine the solution alongside the people who will use it." },
  { title: "Improve", text: "We review what’s working and decide on the next practical improvement." },
];

const questions = [
  { question: "We’re interested in AI, but don’t know where to start.", answer: "That’s a good place to begin. We start with your business goals and current workflows, then identify a focused opportunity worth exploring. You don’t need a technical brief or a preferred tool." },
  { question: "Can you work with the tools we already use?", answer: "We start by understanding your existing setup. Where suitable access and integrations are available, we can work with your current tools. We assess compatibility and any constraints before recommending an approach." },
  { question: "What does an implementation project include?", answer: "The scope depends on the problem. A project can include discovery, workflow design, building and testing, documentation, and team training. We agree on the deliverables and responsibilities before work begins." },
  { question: "Can you guarantee rankings or mentions in AI answers?", answer: "No one controls how a search engine ranks pages or how an AI system selects its sources. We focus on the parts we can improve: technical accessibility, clear information, useful content, and a sound measurement approach." },
  { question: "Do you offer support after launch?", answer: "Ongoing support and improvement can be included in the engagement. We discuss the level of help you need and agree on it as part of the project scope." },
];

function BusinessMap() {
  const [active, setActive] = useState(0);
  return (
    <div className="kl-map" aria-label="Explore our connected approach to AI">
      <div className="kl-map-top"><span className="kl-map-dot" /> A CONNECTED APPROACH <span>KOHELET / AI</span></div>
      <div className="kl-map-canvas">
        <svg className="kl-map-lines" viewBox="0 0 510 440" fill="none" aria-hidden="true">
          <path d="M164 108H356V224H148V350H350" stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" />
          <circle cx="356" cy="108" r="5" fill="currentColor" />
          <circle cx="148" cy="224" r="5" fill="currentColor" />
          <circle cx="350" cy="350" r="5" fill="currentColor" />
          <circle cx="389" cy="325" r="83" stroke="currentColor" strokeOpacity=".17" />
          <circle cx="389" cy="325" r="104" stroke="currentColor" strokeOpacity=".12" />
        </svg>
        <span className="kl-map-orbit" aria-hidden="true"><MoveUpRight strokeWidth={1} /></span>
        {pathways.map((pathway, index) => {
          const Icon = pathway.icon;
          return (
            <button key={pathway.number} type="button" className={`kl-map-node kl-map-node-${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)}>
              <span className="kl-node-top"><Icon size={17} strokeWidth={1.5} /><span>{pathway.number} / {pathway.label}</span><ArrowUpRight size={15} /></span>
              <strong>{pathway.title}</strong>
              <span className="kl-node-description">{pathway.subtitle}</span>
            </button>
          );
        })}
      </div>
      <div className="kl-map-caption" aria-live="polite" aria-atomic="true">
        <span>{pathways[active].number} <span className="kl-map-caption-line" /> 03</span>
        <p>{pathways[active].description}</p>
      </div>
      <span className="kl-map-hint">Select a step to explore <ArrowUpRight size={12} /></span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="kl-page" id="top">
      <a href="#main-content" className="kl-skip-link">Skip to content</a>
      <header className="kl-header kl-container">
        <a href="#top" className="kl-brand" aria-label="Kohelet — back to top">
          <Image src="/logo-horizontal-no-digital.svg" alt="Kohelet" width={108} height={44} priority />
          <span className="kl-brand-divider" />
          <span className="kl-brand-caption">AI, with<br />purpose.</span>
        </a>
        <nav className="kl-nav" aria-label="Main navigation">
          <a href="#services">What we do</a>
          <a href="#approach">Our approach</a>
          <a href="#work">Selected work</a>
        </nav>
        <a href="#contact" className="kl-nav-contact">Let’s talk <ArrowUpRight size={17} /></a>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="kl-hero kl-container" aria-labelledby="kl-hero-title">
          <div className="kl-hero-copy">
            <div className="kl-eyebrow"><span className="kl-square" /> PRACTICAL AI. REAL BUSINESS.</div>
            <h1 id="kl-hero-title">Make AI<br />work for<br /><em>your business.</em></h1>
            <p className="kl-hero-description">Be easier to find. Make everyday work flow.<br className="kl-desktop-break" /> Move forward with a clear plan.</p>
            <div className="kl-hero-actions">
              <a className="kl-button kl-button-primary" href="#contact">Let’s talk about your business <ArrowUpRight size={18} /></a>
              <a className="kl-text-link" href="#services">Explore our services <ArrowDown size={15} /></a>
            </div>
            <div className="kl-hero-note"><span /> Human thinking. Useful technology.</div>
          </div>
          <BusinessMap />
        </section>

        <div className="kl-intro-strip kl-container">
          <p>BIG POSSIBILITIES.<br /><span>PRACTICAL STARTING POINTS.</span></p>
          <div><Search size={18} /><span>Stronger visibility</span></div>
          <div><Network size={18} /><span>Smarter workflows</span></div>
          <div><Compass size={18} /><span>Clearer decisions</span></div>
        </div>

        <section className="kl-services kl-container kl-section" id="services" aria-labelledby="kl-services-title">
          <div className="kl-section-heading">
            <div className="kl-eyebrow"><span className="kl-square" /> WHAT WE DO</div>
            <div><h2 id="kl-services-title">Less AI noise.<br /><em>More forward motion.</em></h2><p>We connect the possibilities of AI to the things<br className="kl-desktop-break" /> your business actually needs.</p></div>
          </div>
          <div className="kl-service-list">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="kl-service" key={service.number}>
                  <div className="kl-service-number">/{service.number}<span><Icon size={24} strokeWidth={1.5} /></span></div>
                  <div className="kl-service-title"><p className="kl-label">{service.eyebrow}</p><h3>{service.title}</h3></div>
                  <div className="kl-service-copy"><h4>{service.problem}</h4><p>{service.description}</p><ul className="kl-tags" aria-label="Example areas of work">{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><p className="kl-service-outcome"><ArrowRight size={16} />{service.outcome}</p></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="kl-approach" id="approach" aria-labelledby="kl-approach-title">
          <div className="kl-container">
            <div className="kl-approach-heading"><div><div className="kl-eyebrow"><span className="kl-square" /> HOW WE WORK</div><h2 id="kl-approach-title">Start with a challenge.<br /><em>Build what matters.</em></h2></div><p>No technology for technology’s sake.<br />Just a thoughtful process, from the first<br className="kl-desktop-break" /> conversation to the next improvement.</p></div>
            <ol className="kl-process">{process.map((step, index) => <li key={step.title}><div className="kl-process-track"><span>0{index + 1}</span><ArrowRight size={20} strokeWidth={1.3} /></div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
            <div className="kl-approach-foot"><Check size={15} /> Built around your business. Explained in plain language.</div>
          </div>
        </section>

        <section className="kl-work kl-container kl-section" id="work" aria-labelledby="kl-work-title">
          <div className="kl-work-heading"><div><div className="kl-eyebrow"><span className="kl-square" /> SELECTED WORK</div><h2 id="kl-work-title">Ideas, <em>made real.</em></h2></div><p>Our approach comes from building.<br />A selection of Kohelet’s web and platform work.</p></div>
          <div className="kl-projects">
            <a className="kl-project" href="https://www.blue-marine.co.il" target="_blank" rel="noopener noreferrer" aria-label="View Blue Marine website (opens in a new tab)">
              <div className="kl-project-image kl-project-image-marine"><div className="kl-project-browser"><div className="kl-browser-bar"><span /><span /><span /><p>blue-marine.co.il</p></div><Image src="/portfolio/blue-marine.png" alt="Blue Marine website with an oceanfront venue and coastal design" width={1265} height={3215} sizes="(max-width: 700px) 90vw, 45vw" /></div><span className="kl-project-visit"><ArrowUpRight size={21} /></span></div>
              <div className="kl-project-caption"><div><h3>Blue Marine</h3><p>A digital presence for a seaside bridal venue.</p></div><span>BUSINESS WEBSITE</span></div>
            </a>
            <a className="kl-project" href="https://www.yachad.world/he" target="_blank" rel="noopener noreferrer" aria-label="View Yachad website (opens in a new tab)">
              <div className="kl-project-image kl-project-image-yachad"><div className="kl-project-browser"><div className="kl-browser-bar"><span /><span /><span /><p>yachad.world</p></div><Image src="/portfolio/yachad.png" alt="Yachad community platform with emergency flight and support information" width={1265} height={2074} sizes="(max-width: 700px) 90vw, 45vw" /></div><span className="kl-project-visit"><ArrowUpRight size={21} /></span></div>
              <div className="kl-project-caption"><div><h3>Yachad</h3><p>A platform connecting people with practical support.</p></div><span>COMMUNITY PLATFORM</span></div>
            </a>
          </div>
        </section>

        <section className="kl-faq kl-container kl-section" aria-labelledby="kl-faq-title">
          <div><div className="kl-eyebrow"><span className="kl-square" /> A FEW GOOD QUESTIONS</div><h2 id="kl-faq-title">A little more<br /><em>clarity.</em></h2><p>Every business starts<br className="kl-desktop-break" /> somewhere different.</p></div>
          <div className="kl-faq-list">{questions.map((item, index) => <details key={item.question} className="kl-faq-item"><summary><span className="kl-faq-number">0{index + 1}</span><span>{item.question}</span><Plus size={18} strokeWidth={1.5} /></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="kl-contact" id="contact" aria-labelledby="kl-contact-title">
          <div className="kl-container kl-contact-grid"><div className="kl-contact-copy"><div className="kl-eyebrow"><span className="kl-square" /> YOUR NEXT STEP</div><h2 id="kl-contact-title">Let’s make<br /><em>AI useful.</em></h2><p>Tell us a little about your business and<br className="kl-desktop-break" /> what you’d like to make better.<br />We’ll start from there.</p><a href="mailto:info@kohelet.digital" className="kl-contact-email">info@kohelet.digital <ArrowUpRight size={18} /></a><div className="kl-contact-mark" aria-hidden="true"><svg viewBox="0 0 120 120" fill="none"><path d="M22 95 95 22M22 22h73v73" stroke="currentColor" strokeWidth="1.5" /><path d="M6 79 79 6M41 114l73-73" stroke="currentColor" strokeWidth="1" opacity=".3" /></svg></div></div><ContactForm /></div>
        </section>
      </main>

      <footer className="kl-footer kl-container"><a className="kl-footer-brand" href="#top" aria-label="Kohelet — back to top"><Image src="/logo-horizontal-no-digital.svg" alt="Kohelet" width={100} height={41} /><span>Human thinking.<br />Useful technology.</span></a><p>© {new Date().getFullYear()} Kohelet</p><a href="#top" className="kl-text-link">Back to top <ArrowUpRight size={15} /></a></footer>
    </div>
  );
}
