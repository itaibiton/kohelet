export const nav = {
  links: [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Work", href: "#work" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Let's talk", href: "#contact" },
};

export const hero = {
  eyebrow: "Independent AI consultancy · Tel Aviv, working worldwide",
  headline: ["Make AI work", "for your business."],
  lede:
    "Kohelet helps business owners turn AI into practical results: easier to find, less repetitive work, and clearer decisions. No technical background required.",
  primaryCta: { label: "Let's talk about your business.", href: "#contact" },
  secondaryCta: { label: "See what we do", href: "#services" },
  note: "A short first conversation. No preparation needed.",
};

export type LoopStage = {
  id: "visibility" | "workflows" | "decisions" | "improve";
  label: string;
  title: string;
  body: string;
};

export const loop = {
  eyebrow: "How it fits together",
  heading: "Three things AI should do for a business.",
  intro:
    "They work as a loop. Being found brings in demand. Connected workflows handle it without the busywork. The data that comes out makes the next decision clearer. Then you improve and go around again.",
  stages: [
    {
      id: "visibility",
      label: "Visibility",
      title: "Be found where people look now.",
      body: "Customers ask search engines and AI assistants before they ever call. Clear structure and well-written content give both something to point to.",
    },
    {
      id: "workflows",
      label: "Workflows",
      title: "Let the routine run itself.",
      body: "Enquiries, follow-ups, documents and CRM updates move on their own. People step in only where judgement is needed.",
    },
    {
      id: "decisions",
      label: "Decisions",
      title: "Decide with the picture in front of you.",
      body: "When work flows through connected systems, you can see what is happening and choose the next move with confidence.",
    },
    {
      id: "improve",
      label: "Improve",
      title: "Then go around again.",
      body: "Each cycle shows what to sharpen: which content to improve, which steps to automate next, which numbers to watch.",
    },
  ] satisfies LoopStage[],
};

export type Service = {
  index: string;
  id: string;
  name: string;
  short: string;
  problem: string;
  work: { intro: string; items: string[] };
  benefit: string;
  honesty?: string;
};

export const services: Service[] = [
  {
    index: "01",
    id: "ai-seo",
    name: "AI SEO & AI Search Optimization",
    short: "Be found in search and in AI answers.",
    problem:
      "Search has changed. People ask Google's AI overviews, ChatGPT and Perplexity, and the answers draw on sites that are well structured and clearly written. Many good businesses are simply hard for these systems to read.",
    work: {
      intro: "We make your site legible to people and machines.",
      items: [
        "Technical SEO: speed, indexing, clean site architecture",
        "Content structure that answers the questions customers actually ask",
        "Structured data that describes your business, services and locations",
        "Discoverability across traditional search and AI-powered answers",
      ],
    },
    benefit:
      "Your business becomes easier to find, understand and recommend, by search engines and by the assistants people increasingly ask first.",
    honesty:
      "We don't promise rankings or AI citations. Nobody honestly can. We make you a stronger candidate for both.",
  },
  {
    index: "02",
    id: "automation",
    name: "AI Implementation & Automation",
    short: "Remove the work that doesn't need a person.",
    problem:
      "Too much of the week goes to re-typing details, chasing replies and moving information between tools. It is tiring, error-prone, and it keeps good people from the work that needs them.",
    work: {
      intro: "Example use cases we design and build:",
      items: [
        "Practical assistants for your team and your customers",
        "Knowledge workflows that answer from your own documents",
        "Lead handling that qualifies, routes and follows up on enquiries",
        "CRM connections so records update themselves",
        "Automation of repetitive, rule-based processes",
      ],
    },
    benefit:
      "Hours back every week, faster responses, fewer dropped balls. Built on the tools you already use wherever possible.",
  },
  {
    index: "03",
    id: "consulting",
    name: "AI Consulting & Training",
    short: "Know where AI pays off, and where to leave it alone.",
    problem:
      "Everyone says “use AI”. Few can say where it will pay off in your specific business, what it will cost, and what should stay exactly as it is.",
    work: {
      intro: "We give you a plan your team can actually carry out.",
      items: [
        "Opportunity discovery across sales, operations and service",
        "Workflow audits that show where time and money leak",
        "Tool evaluation, independent of any vendor",
        "Implementation roadmaps with realistic priorities",
        "Team enablement, so people use what you invest in",
      ],
    },
    benefit:
      "Clear priorities, fewer expensive experiments, and a team that feels confident rather than anxious about AI.",
  },
];

export const process = {
  eyebrow: "How we work",
  heading: "A simple process, repeated.",
  steps: [
    {
      name: "Discover",
      body: "We learn how your business actually runs: where time goes, where customers come from, what frustrates your team.",
    },
    {
      name: "Prioritize",
      body: "We rank opportunities by value and effort and agree on the first wins. Small, visible, worth doing.",
    },
    {
      name: "Implement",
      body: "We build, connect and test alongside your team, on your tools where possible, with clear handover.",
    },
    {
      name: "Improve",
      body: "We measure what changed, refine what works, retire what doesn't, and decide together what comes next.",
    },
  ],
};

export const work = {
  eyebrow: "Selected work",
  heading: "Software we've designed and shipped.",
  intro:
    "Different briefs, the same standard: clear, fast, and built for the people who use it.",
  projects: [
    {
      title: "Yachad",
      category: "Community platform",
      description:
        "Real-time platform connecting stranded Israelis abroad with emergency flights, services and mutual aid during crisis situations.",
      url: "https://www.yachad.world/he",
      image: "/portfolio/yachad.png",
    },
    {
      title: "Blue Marine",
      category: "Business website",
      description:
        "Digital presence for a seafront luxury venue in Ashdod, designed for brides preparing for their day.",
      url: "https://www.blue-marine.co.il",
      image: "/portfolio/blue-marine.png",
    },
    {
      title: "Remember Amir Tzur",
      category: "Memorial and education",
      description:
        "Interactive memorial linking 19 QR-coded monuments across Israel to digital stories.",
      url: "https://rememberamirzur.co.il",
      image: "/portfolio/rememberamirzur.png",
    },
    {
      title: "Iron Swords Missing",
      category: "Humanitarian tool",
      description:
        "Volunteer-built registry for reporting and tracking missing persons, with real-time search.",
      url: "https://ironswordsmissing.vercel.app",
      image: "/portfolio/ironswords.png",
    },
  ],
};

export const faq = {
  eyebrow: "Questions",
  heading: "Things people ask before they call.",
  items: [
    {
      q: "Where do we start?",
      a: "With a conversation about your business, not about tools. We ask how work flows today, where time goes and how customers find you. From there we usually suggest a short discovery to map the opportunities and agree on a first step.",
    },
    {
      q: "We already use certain tools. Do we have to switch?",
      a: "No. We work with your existing website, CRM and communication tools wherever possible. Replacing something is a recommendation we make only when the current tool is the actual problem.",
    },
    {
      q: "How big is an implementation?",
      a: "It ranges from a single automation delivered in days to a programme that runs over months. We prefer to start small, prove the value, and expand from what works.",
    },
    {
      q: "Do we need technical staff on our side?",
      a: "No. You need someone who knows the business and can make decisions. We handle the technical side and explain it in plain language as we go.",
    },
    {
      q: "What happens after launch?",
      a: "Ongoing support is available and optional: monitoring, improvements, training new team members, and extending what works to the next process. Many clients keep a light retainer; some prefer project by project.",
    },
  ],
};

export const contact = {
  eyebrow: "Get in touch",
  heading: "Let's talk about your business.",
  body: "Tell us what takes too much time, or what you'd like to be found for. We'll reply with honest thoughts on whether, and where, AI can help.",
  email: "info@kohelet.digital",
  phone: "+972-52-341-0467",
  location: "Remote-first. Based in Tel Aviv.",
  serviceOptions: [
    "AI SEO & AI search optimization",
    "AI implementation & automation",
    "AI consulting & training",
    "Not sure yet",
  ],
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} Kohelet Digital Solutions. All rights reserved.`,
  links: [
    { label: "Main site", href: "/en" },
    { label: "עברית", href: "/he" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kohelet-digital/" },
    { label: "Instagram", href: "https://instagram.com/kohelet.digital" },
    { label: "X", href: "https://x.com/KoheletDigital" },
  ],
};
