/**
 * Landing page copy — single source of truth for /he and /en.
 * Edit text here; the section components under components/landing only render it.
 *
 * TODO placeholders (search for "TODO"):
 *  - contact.whatsapp: real WhatsApp number (wa.me/972XXXXXXXXX)
 *  - founder.personal: one personal, human line about Itai
 *  - founder photo: /public/images/itai-biton.jpg (see components/landing/Founder.tsx)
 */

export type LandingLocale = "he" | "en";

/** Illustrations that cycle in the hero frame (drawn in components/landing/Hero.tsx). */
export type HeroVisual =
  | { kind: "robot"; alt: string }
  | { kind: "automation" }
  | { kind: "answers" }
  | { kind: "build" };

export interface Service {
  title: string;
  description: string;
}

export interface Pillar {
  icon: "brain" | "zap" | "users" | "chart";
  title: string;
  description: string;
}

export interface Outcome {
  title: string;
  description: string;
}

export interface LandingContent {
  meta: {
    title: string;
    description: string;
  };
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    links: { label: string; href: string }[];
    menuOpen: string;
    menuClose: string;
    switchLocale: { label: string; locale: LandingLocale };
  };
  hero: {
    headline: {
      /** Fixed first line(s); use \n for a manual break. */
      lead: string;
      /** Last line, swapped every 2.5s in sync with the visuals. Keep them short. */
      words: string[];
      /** vw size of the headline (clamped in CSS); keep lines short so the illustration stays visible. */
      fitVw: number;
    };
    visuals: HeroVisual[];
  };
  intro: {
    kicker: string;
    heading: string;
    body: string;
  };
  solutions: {
    kicker: string;
    title: string;
    services: Service[];
  };
  pillars: {
    kicker: string;
    title: string;
    items: Pillar[];
  };
  outcomes: {
    kicker: string;
    title: string;
    items: Outcome[];
  };
  founder: {
    kicker: string;
    title: string;
    name: string;
    role: string;
    bio: string;
    personal: string;
    photoAlt: string;
  };
  contact: {
    kicker: string;
    title: string;
    body: string;
    whatsapp: { label: string; href: string };
    email: string;
    form: {
      name: string;
      business: string;
      contact: string;
      contactHint: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      again: string;
    };
    mascotAlt: string;
  };
  footer: {
    copyright: string;
    links: { label: string; href: string }[];
  };
}

const he: LandingContent = {
  meta: {
    title: "קהלת דיגיטל | AI שעובד בשביל העסק שלך",
    description:
      "פיתוח תוכנה, הטמעת AI, ייעוץ, AI SEO ואתרים לעסקים. חשיבה אנושית, טכנולוגיה שימושית, תוצאות שאפשר למדוד.",
  },
  brand: {
    name: "קהלת דיגיטל",
    tagline: "חשיבה אנושית. טכנולוגיה שימושית.",
  },
  nav: {
    links: [
      { label: "שירותים", href: "#services" },
      { label: "איך אנחנו עובדים", href: "#approach" },
      { label: "מי מאחורי זה", href: "#founder" },
      { label: "דברו איתנו", href: "#contact" },
    ],
    menuOpen: "פתיחת תפריט",
    menuClose: "סגירת תפריט",
    switchLocale: { label: "EN", locale: "en" },
  },
  hero: {
    headline: {
      lead: "AI שעובד",
      words: ["בשבילך", "לעסק שלך", "למכירות", "לשירות", "לצוות"],
      fitVw: 4.2,
    },
    visuals: [
      { kind: "robot", alt: "רובוט קינג, הקמע של קהלת דיגיטל, רץ קדימה עם גלימה כחולה" },
      { kind: "automation" },
      { kind: "answers" },
      { kind: "build" },
    ],
  },
  intro: {
    kicker: "נעים מאוד",
    heading: "רגע, נציג את עצמנו מחדש.",
    body:
      "קהלת דיגיטל בונה תוכנה ומערכות AI לעסקים שרוצים לעבוד חכם יותר, לא קשה יותר. אנחנו מתחילים מהבעיה העסקית, בוחרים את הטכנולוגיה שמתאימה לה, ומוסרים משהו שעובד תוך שבועות ולא חודשים.",
  },
  solutions: {
    kicker: "שירותים",
    title: "מה אנחנו עושים",
    services: [
      {
        title: "פיתוח תוכנה בהתאמה אישית",
        description:
          "אפליקציות ווב, מערכות פנימיות ואוטומציות שמחליפות אקסלים, קבוצות וואטסאפ ועבודה ידנית.",
      },
      {
        title: "הטמעת AI בעסק",
        description:
          "סוכנים, צ'אטבוטים ותהליכי עבודה חכמים שמתחברים לכלים שכבר יש לכם: CRM, מייל, וואטסאפ ויומן.",
      },
      {
        title: "ייעוץ AI",
        description:
          "אסטרטגיה, הדרכות לצוות ובחירת הכלים הנכונים. בלי באזז, רק מה שבאמת חוסך זמן וכסף.",
      },
      {
        title: "AI SEO (GEO / AEO)",
        description:
          "שהעסק שלכם יופיע בתשובות של ChatGPT, Gemini, Perplexity ו-Grok, לא רק בתוצאות של גוגל.",
      },
      {
        title: "אתרים ודפי נחיתה",
        description:
          "בנויים מהר עם AI, מעוצבים בקפידה, ומוכנים להביא לידים מהיום הראשון.",
      },
    ],
  },
  pillars: {
    kicker: "איך אנחנו עובדים",
    title: "למה קהלת",
    items: [
      {
        icon: "brain",
        title: "חשיבה אנושית קודם",
        description: "מבינים את העסק, האנשים והתהליך לפני שכותבים שורת קוד אחת.",
      },
      {
        icon: "zap",
        title: "נבנה עם AI, נמסר מהר",
        description: "אנחנו עובדים עם הכלים שאנחנו ממליצים עליהם, וזה מקצר זמני פיתוח דרמטית.",
      },
      {
        icon: "users",
        title: "צוות קטן, בלי שכבות",
        description: "מדברים ישירות עם מי שבונה. בלי מתווכים, בלי חיכוך, בלי הפתעות.",
      },
      {
        icon: "chart",
        title: "תוצאות שאפשר למדוד",
        description: "כל פרויקט מתחיל ביעד ברור: שעות שנחסכו, לידים שנענו, הכנסה שנוספה.",
      },
    ],
  },
  outcomes: {
    kicker: "מה יוצא מזה",
    title: "מה אתם מקבלים",
    items: [
      {
        title: "שעות חוזרות לצוות",
        description:
          "המשימות שחוזרות על עצמן, הזנת נתונים, מעקב אחרי לידים, דוחות, רצות לבד. הצוות מתפנה לעבודה שמביאה כסף.",
      },
      {
        title: "מענה ללקוחות גם ב-23:00",
        description:
          "סוכן AI שמכיר את העסק לעומק: עונה, קובע פגישות, אוסף פרטים ומעביר לבן אדם בדיוק כשצריך.",
      },
      {
        title: "מערכת אחת במקום עשרה קבצים",
        description:
          "מערכת פנימית שבנויה סביב התהליך שלכם, לא להפך. כל המידע במקום אחד, לכל הצוות.",
      },
      {
        title: "נראות בעידן התשובות",
        description:
          "כשלקוח שואל AI מי הכי מתאים לו, השם שלכם מופיע בתשובה, עם ההסבר הנכון.",
      },
    ],
  },
  founder: {
    kicker: "מי מאחורי זה",
    title: "נעים להכיר, איתי",
    name: "איתי ביטון",
    role: "מהנדס Full-Stack ו-AI, שותף-מייסד ו-CTO בסטארטאפ",
    bio:
      "איתי בנה מוצרים מהרעיון הראשון ועד הלקוחות המשלמים, גם כמהנדס וגם כמי שאחראי על הטכנולוגיה כולה. בקהלת הוא מביא את אותה גישה לעסקים: להבין מה באמת צריך לקרות, לבנות את זה בעצמו, ולמדוד שזה עובד.",
    // TODO: replace with one real personal line (e.g. what Itai does when he is not in front of a screen).
    personal: "TODO: שורה אישית אחת על איתי, משהו שלא קשור למחשבים.",
    photoAlt: "איתי ביטון, מייסד קהלת דיגיטל",
  },
  contact: {
    kicker: "דברו איתנו",
    title: "בואו נדבר",
    body: "ספרו לנו מה מעסיק אתכם ונחזור אליכם תוך יום עבודה. בלי התחייבות, בלי מצגות מכירה.",
    // TODO: replace XXXXXXXXX with the real WhatsApp number.
    whatsapp: { label: "כתבו לנו בוואטסאפ", href: "https://wa.me/972XXXXXXXXX" },
    email: "info@kohelet.digital",
    form: {
      name: "שם",
      business: "שם העסק",
      contact: "אימייל או טלפון",
      contactHint: "איך נוח לכם שנחזור אליכם",
      message: "מה תרצו לבנות?",
      submit: "שלחו",
      sending: "שולחים…",
      success: "קיבלנו. נחזור אליכם תוך יום עבודה.",
      error: "משהו לא עבד. אפשר לכתוב לנו ישירות למייל או בוואטסאפ.",
      again: "שלחו הודעה נוספת",
    },
    mascotAlt: "רובוט קינג, הקמע של קהלת דיגיטל",
  },
  footer: {
    copyright: "© 2026 קהלת דיגיטל. כל הזכויות שמורות.",
    links: [
      { label: "בלוג", href: "/blog" },
      { label: "info@kohelet.digital", href: "mailto:info@kohelet.digital" },
    ],
  },
};

const en: LandingContent = {
  meta: {
    title: "Kohelet Digital | AI that works for your business",
    description:
      "Custom software, AI integration, AI consulting, AI SEO and fast websites for businesses. Human thinking, useful technology, measurable results.",
  },
  brand: {
    name: "Kohelet Digital",
    tagline: "Human thinking. Useful technology.",
  },
  nav: {
    links: [
      { label: "Services", href: "#services" },
      { label: "How we work", href: "#approach" },
      { label: "Founder", href: "#founder" },
      { label: "Contact", href: "#contact" },
    ],
    menuOpen: "Open menu",
    menuClose: "Close menu",
    switchLocale: { label: "עב", locale: "he" },
  },
  hero: {
    headline: {
      lead: "AI that\nworks",
      words: ["for you", "for sales", "for teams", "for growth"],
      fitVw: 3.8,
    },
    visuals: [
      { kind: "robot", alt: "Robot King, the Kohelet Digital mascot, running forward in a blue cape" },
      { kind: "automation" },
      { kind: "answers" },
      { kind: "build" },
    ],
  },
  intro: {
    kicker: "Nice to meet you",
    heading: "Allow us to reintroduce ourselves.",
    body:
      "Kohelet Digital builds software and AI systems for businesses that want to work smarter, not harder. We start from the business problem, pick the technology that fits it, and ship something that works in weeks, not months.",
  },
  solutions: {
    kicker: "Services",
    title: "What we do",
    services: [
      {
        title: "Custom software development",
        description:
          "Web apps, internal systems and automations that replace spreadsheets, WhatsApp groups and manual work.",
      },
      {
        title: "AI integration for your business",
        description:
          "Agents, chatbots and smart workflows connected to the tools you already use: CRM, email, WhatsApp and calendar.",
      },
      {
        title: "AI consulting",
        description:
          "Strategy, team training and picking the right tools. No buzzwords, only what actually saves time and money.",
      },
      {
        title: "AI SEO (GEO / AEO)",
        description:
          "Get your business into the answers of ChatGPT, Gemini, Perplexity and Grok, not just Google results.",
      },
      {
        title: "Websites and landing pages",
        description:
          "Built fast with AI, designed with care, and ready to bring in leads from day one.",
      },
    ],
  },
  pillars: {
    kicker: "How we work",
    title: "Why Kohelet",
    items: [
      {
        icon: "brain",
        title: "Human thinking first",
        description: "We understand the business, the people and the process before writing a single line of code.",
      },
      {
        icon: "zap",
        title: "Built with AI, delivered fast",
        description: "We work with the tools we recommend, and it cuts development time dramatically.",
      },
      {
        icon: "users",
        title: "Small team, no layers",
        description: "You talk directly to the person building it. No middlemen, no friction, no surprises.",
      },
      {
        icon: "chart",
        title: "Measurable results",
        description: "Every project starts with a clear target: hours saved, leads answered, revenue added.",
      },
    ],
  },
  outcomes: {
    kicker: "Outcomes",
    title: "What you get",
    items: [
      {
        title: "Hours back for your team",
        description:
          "Repetitive tasks, data entry, lead follow-up, reporting, run on their own. Your team gets back to work that makes money.",
      },
      {
        title: "Customers answered at 11pm",
        description:
          "An AI agent that knows your business inside out: answers, books meetings, collects details and hands over to a human exactly when needed.",
      },
      {
        title: "One system instead of ten files",
        description:
          "An internal system built around your process, not the other way around. All the information in one place, for the whole team.",
      },
      {
        title: "Visibility in the age of answers",
        description:
          "When a customer asks an AI who is the right fit, your name shows up in the answer, with the right explanation.",
      },
    ],
  },
  founder: {
    kicker: "Founder",
    title: "Meet Itai",
    name: "Itai Biton",
    role: "Full-stack and AI engineer, startup co-founder and CTO",
    bio:
      "Itai has taken products from the first idea to paying customers, both as the engineer and as the person responsible for the whole technology stack. At Kohelet he brings the same approach to businesses: understand what really needs to happen, build it himself, and measure that it works.",
    // TODO: replace with one real personal line (e.g. what Itai does when he is not in front of a screen).
    personal: "TODO: one personal line about Itai that has nothing to do with computers.",
    photoAlt: "Itai Biton, founder of Kohelet Digital",
  },
  contact: {
    kicker: "Contact",
    title: "Let's talk",
    body: "Tell us what is on your mind and we will get back to you within one business day. No commitment, no sales decks.",
    // TODO: replace XXXXXXXXX with the real WhatsApp number.
    whatsapp: { label: "Message us on WhatsApp", href: "https://wa.me/972XXXXXXXXX" },
    email: "info@kohelet.digital",
    form: {
      name: "Name",
      business: "Business",
      contact: "Email or phone",
      contactHint: "Whichever is easier for us to reach you",
      message: "What would you like to build?",
      submit: "Send",
      sending: "Sending…",
      success: "Got it. We will get back to you within one business day.",
      error: "Something went wrong. You can email us directly or message us on WhatsApp.",
      again: "Send another message",
    },
    mascotAlt: "Robot King, the Kohelet Digital mascot",
  },
  footer: {
    copyright: "© 2026 Kohelet Digital. All rights reserved.",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "info@kohelet.digital", href: "mailto:info@kohelet.digital" },
    ],
  },
};

export const landing: Record<LandingLocale, LandingContent> = { he, en };

export function getLanding(locale: string): LandingContent {
  return landing[(locale as LandingLocale) in landing ? (locale as LandingLocale) : "he"];
}
