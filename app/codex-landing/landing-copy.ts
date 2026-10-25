export type LandingLocale = "en" | "he";

type TwoLines = [string, string];
type ThreeLines = [string, string, string];
type ServiceCopy = { number: string; eyebrow: string; title: TwoLines; problem: string; description: string; tags: string[]; outcome: string };
type ProjectCopy = { key: string; title: string; description: string; category: string; alt: string; visitLabel: string; domain: string; href: string; image: string; height: number };

export type LandingCopy = {
  brand: string;
  backToTopLabel: string;
  skip: string;
  navigationLabel: string;
  navigation: { services: string; approach: string; work: string };
  contactShort: string;
  languageSwitchLabel: string;
  hero: { eyebrow: string; title: ThreeLines; description: TwoLines; cta: string; explore: string; note: string; imageAlt: string };
  strip: { title: TwoLines; benefits: ThreeLines };
  services: { eyebrow: string; title: TwoLines; description: TwoLines; areasLabel: string; items: ServiceCopy[] };
  approach: { eyebrow: string; title: TwoLines; description: ThreeLines; steps: { number: string; title: string; text: string }[]; foot: string };
  work: { eyebrow: string; title: TwoLines; description: TwoLines; projects: ProjectCopy[] };
  faq: { eyebrow: string; title: TwoLines; description: TwoLines; questions: { number: string; question: string; answer: string }[] };
  contact: { eyebrow: string; title: TwoLines; description: ThreeLines; email: string };
  footer: { tagline: TwoLines; brand: string; backToTop: string };
};

export const landingCopy: Record<LandingLocale, LandingCopy> = {
  en: {
    brand: "Kohelet",
    backToTopLabel: "Kohelet — back to top",
    skip: "Skip to content",
    navigationLabel: "Main navigation",
    navigation: { services: "What we do", approach: "Our approach", work: "Selected work" },
    contactShort: "Let’s talk",
    languageSwitchLabel: "Choose language",
    hero: {
      eyebrow: "PRACTICAL AI. REAL BUSINESS.",
      title: ["Make AI", "work for", "your business."],
      description: ["Custom apps and websites. Practical AI and automation.", "Built around the way your business works."],
      cta: "Let’s talk about your business",
      explore: "Explore our services",
      note: "Human thinking. Useful technology.",
      imageAlt: "Kohelet’s crowned robot king leaps over a circuit-board hurdle, writes code and connects an automation workflow, with a cobalt cape, flying documents and technology parts trailing behind.",
    },
    strip: { title: ["BIG POSSIBILITIES.", "PRACTICAL STARTING POINTS."], benefits: ["Stronger visibility", "Smarter workflows", "Clearer decisions"] },
    services: {
      eyebrow: "WHAT WE DO",
      title: ["Less AI noise.", "More forward motion."],
      description: ["From apps and websites to AI and automation,", "we build the tools your business needs."],
      areasLabel: "Example areas of work",
      items: [
        { number: "/01", eyebrow: "AI SEO & AI SEARCH OPTIMIZATION", title: ["Get discovered.", "Be understood."], problem: "Great work deserves to be found.", description: "Your customers are searching in new ways. We make your website easier for search engines and AI systems to understand, with useful content and a strong technical foundation.", tags: ["Technical SEO", "Content structure", "Structured data", "AI search visibility"], outcome: "A clearer path from a customer’s question to your business." },
        { number: "/02", eyebrow: "AI IMPLEMENTATION & AUTOMATION", title: ["Less busywork.", "More possibility."], problem: "Your team’s time is too valuable for copy-paste.", description: "We find the handoffs and repeat tasks that slow you down, then build practical AI workflows around the way you work. The right solution should make the day simpler.", tags: ["AI assistants", "Knowledge workflows", "Lead handling", "CRM connections"], outcome: "More time for the work that needs a human." },
        { number: "/03", eyebrow: "AI CONSULTING & TEAM TRAINING", title: ["A clear plan.", "A confident team."], problem: "You don’t need another list of AI tools.", description: "You need to know what’s useful for your business. We help you assess the opportunities, choose where to start, and give your team the skills to put the plan into practice.", tags: ["Opportunity discovery", "Tool evaluation", "Practical roadmaps", "Team enablement"], outcome: "Better decisions about where AI belongs in your business." },
        { number: "/04", eyebrow: "APP & WEBSITE DEVELOPMENT", title: ["Apps and websites.", "Built for your business."], problem: "Turn your idea into a product people can use.", description: "We plan, design and develop websites, apps and custom business platforms. From the user experience and frontend to backend systems, testing and launch, we handle the complete build.", tags: ["Business websites", "Web apps", "Custom platforms", "Design to launch"], outcome: "A complete digital product, shaped around your customers and the way you work." },
      ],
    },
    approach: {
      eyebrow: "HOW WE WORK",
      title: ["Start with a challenge.", "Build what matters."],
      description: ["No technology for technology’s sake.", "Just a thoughtful process, from the first", "conversation to the next improvement."],
      steps: [
        { number: "01", title: "Discover", text: "We listen first. Your goals, your team, and the work that gets in the way." },
        { number: "02", title: "Prioritize", text: "We choose a useful starting point, with a clear scope and a reason to do it." },
        { number: "03", title: "Implement", text: "We build, test, and refine the solution alongside the people who will use it." },
        { number: "04", title: "Improve", text: "We review what’s working and decide on the next practical improvement." },
      ],
      foot: "Built around your business. Explained in plain language.",
    },
    work: {
      eyebrow: "SELECTED WORK",
      title: ["Ideas,", "made real."],
      description: ["Our approach comes from building.", "A selection of Kohelet’s web and platform work."],
      projects: [
        { key: "marine", title: "Blue Marine", description: "A digital presence for a seaside bridal venue.", category: "BUSINESS WEBSITE", alt: "Blue Marine website with an oceanfront venue and coastal design", visitLabel: "View Blue Marine website (opens in a new tab)", domain: "blue-marine.co.il", href: "https://www.blue-marine.co.il", image: "/portfolio/blue-marine.png", height: 3215 },
        { key: "yachad", title: "Yachad", description: "A platform connecting people with practical support.", category: "COMMUNITY PLATFORM", alt: "Yachad community platform with emergency flight and support information", visitLabel: "View Yachad website (opens in a new tab)", domain: "yachad.world", href: "https://www.yachad.world/he", image: "/portfolio/yachad.png", height: 2074 },
      ],
    },
    faq: {
      eyebrow: "A FEW GOOD QUESTIONS",
      title: ["A little more", "clarity."],
      description: ["Every business starts", "somewhere different."],
      questions: [
        { number: "01", question: "We’re interested in AI, but don’t know where to start.", answer: "That’s a good place to begin. We start with your business goals and current workflows, then identify a focused opportunity worth exploring. You don’t need a technical brief or a preferred tool." },
        { number: "02", question: "Can you work with the tools we already use?", answer: "We start by understanding your existing setup. Where suitable access and integrations are available, we can work with your current tools. We assess compatibility and any constraints before recommending an approach." },
        { number: "03", question: "What can a development or AI project include?", answer: "The scope depends on your goals. A full development project can cover planning, design, frontend and backend development, testing and launch. AI projects can include workflow design, implementation, documentation and team training. We agree on the deliverables and responsibilities before work begins." },
        { number: "04", question: "Can you guarantee rankings or mentions in AI answers?", answer: "No one controls how a search engine ranks pages or how an AI system selects its sources. We focus on the parts we can improve: technical accessibility, clear information, useful content, and a sound measurement approach." },
        { number: "05", question: "Do you offer support after launch?", answer: "Ongoing support and improvement can be included in the engagement. We discuss the level of help you need and agree on it as part of the project scope." },
      ],
    },
    contact: { eyebrow: "YOUR NEXT STEP", title: ["Let’s make", "AI useful."], description: ["Tell us a little about your business and", "what you’d like to make better.", "We’ll start from there."], email: "info@kohelet.digital" },
    footer: { tagline: ["Human thinking.", "Useful technology."], brand: "Kohelet", backToTop: "Back to top" },
  },
  he: {
    brand: "קהלת",
    backToTopLabel: "קהלת — חזרה לראש העמוד",
    skip: "דילוג לתוכן",
    navigationLabel: "ניווט ראשי",
    navigation: { services: "מה אנחנו עושים", approach: "איך אנחנו עובדים", work: "פרויקטים נבחרים" },
    contactShort: "בואו נדבר",
    languageSwitchLabel: "בחירת שפה",
    hero: {
      eyebrow: "בינה מלאכותית. ערך לעסק.",
      title: ["AI שעובד", "בשביל", "העסק שלכם."],
      description: ["פיתוח אפליקציות ואתרים. בינה מלאכותית ואוטומציה.", "פתרונות שנבנים סביב הדרך שבה העסק שלכם עובד."],
      cta: "בואו נדבר על העסק שלכם",
      explore: "לכל השירותים שלנו",
      note: "חשיבה אנושית. טכנולוגיה שימושית.",
      imageAlt: "המלך הרובוטי של קהלת קופץ מעל מחסום של מעגל מודפס, כותב קוד ומחבר תהליך אוטומציה, עם גלימה כחולה, מסמכים ורכיבים טכנולוגיים המתעופפים מאחוריו.",
    },
    strip: { title: ["אפשרויות גדולות.", "צעדים מעשיים."], benefits: ["נראות חזקה יותר", "תהליכים חכמים יותר", "החלטות ברורות יותר"] },
    services: {
      eyebrow: "מה אנחנו עושים",
      title: ["פחות רעש סביב AI.", "יותר התקדמות בעסק."],
      description: ["מאתרים ואפליקציות ועד בינה מלאכותית ואוטומציה,", "בונים את הכלים שהעסק שלכם צריך."],
      areasLabel: "דוגמאות לתחומי עבודה",
      items: [
        { number: "/01", eyebrow: "קידום במנועי חיפוש ובמערכות AI", title: ["שימצאו אתכם.", "שיבינו אתכם."], problem: "לעבודה טובה מגיע שיגלו אותה.", description: "הלקוחות שלכם מחפשים בדרכים חדשות. אנחנו עוזרים למנועי חיפוש ולמערכות AI להבין את האתר שלכם, באמצעות תוכן מועיל ותשתית טכנית נכונה.", tags: ["קידום טכני", "מבנה תוכן", "נתונים מובנים", "נראות בחיפוש AI"], outcome: "דרך ברורה יותר מהשאלה של הלקוח לעסק שלכם." },
        { number: "/02", eyebrow: "הטמעת בינה מלאכותית ואוטומציה", title: ["פחות עבודה חוזרת.", "יותר מקום לצמוח."], problem: "הזמן של הצוות יקר מדי להעתק־הדבק.", description: "מזהים את המשימות החוזרות ואת המעברים בין מערכות שמאטים אתכם, ובונים סביבם תהליכי AI מעשיים. פתרון טוב צריך להפוך את יום העבודה לפשוט יותר.", tags: ["עוזרי AI", "תהליכי ניהול ידע", "טיפול בפניות", "חיבור למערכות CRM"], outcome: "יותר זמן לעבודה שצריכה בני אדם." },
        { number: "/03", eyebrow: "ייעוץ AI והדרכת צוותים", title: ["תוכנית ברורה.", "צוות שיודע לפעול."], problem: "עוד רשימה של כלי AI לא תקדם אתכם.", description: "צריך להבין מה מתאים לעסק שלכם. אנחנו עוזרים לזהות הזדמנויות, לבחור מאיפה להתחיל ולתת לצוות את הידע והכלים להפוך את התוכנית לעבודה יומיומית.", tags: ["זיהוי הזדמנויות", "בחירת כלים", "תוכנית פעולה", "הדרכת צוותים"], outcome: "החלטות טובות יותר על המקום של AI בעסק שלכם." },
        { number: "/04", eyebrow: "פיתוח אפליקציות ואתרים", title: ["אתרים ואפליקציות.", "בדיוק לעסק שלכם."], problem: "הופכים רעיון למוצר שאנשים יכולים להשתמש בו.", description: "מתכננים, מעצבים ומפתחים אתרים, אפליקציות ופלטפורמות עסקיות בהתאמה אישית. מחוויית המשתמש והממשק ועד המערכות שמאחוריו, הבדיקות והעלייה לאוויר, מטפלים בפיתוח המלא.", tags: ["אתרים עסקיים", "אפליקציות רשת", "פלטפורמות בהתאמה אישית", "מעיצוב ועד השקה"], outcome: "מוצר דיגיטלי שלם, שנבנה סביב הלקוחות ודרך העבודה שלכם." },
      ],
    },
    approach: {
      eyebrow: "איך אנחנו עובדים",
      title: ["מתחילים באתגר.", "בונים את מה שחשוב."],
      description: ["טכנולוגיה צריכה לשרת מטרה.", "לכן עובדים בתהליך מסודר, מהשיחה הראשונה", "ועד לשיפור הבא."],
      steps: [
        { number: "01", title: "מכירים", text: "קודם מקשיבים. למטרות שלכם, לצוות ולעבודה שמפריעה להתקדם." },
        { number: "02", title: "מתעדפים", text: "בוחרים נקודת התחלה מועילה, עם היקף ברור וסיבה טובה לצאת לדרך." },
        { number: "03", title: "מיישמים", text: "בונים, בודקים ומשפרים את הפתרון יחד עם האנשים שישתמשו בו." },
        { number: "04", title: "משפרים", text: "בודקים מה עובד ומחליטים יחד על השיפור המעשי הבא." },
      ],
      foot: "מותאם לעסק שלכם. מוסבר בשפה ברורה.",
    },
    work: {
      eyebrow: "פרויקטים נבחרים",
      title: ["רעיונות", "שהפכו למציאות."],
      description: ["הגישה שלנו נולדה מתוך עשייה.", "מבחר אתרים ופלטפורמות שבנינו בקהלת."],
      projects: [
        { key: "marine", title: "בלו מרין", description: "נוכחות דיגיטלית למתחם התארגנות כלות מול הים.", category: "אתר עסקי", alt: "אתר בלו מרין בעיצוב בהשראת הים, המציג מתחם התארגנות כלות על קו החוף", visitLabel: "לאתר בלו מרין — נפתח בלשונית חדשה", domain: "blue-marine.co.il", href: "https://www.blue-marine.co.il", image: "/portfolio/blue-marine.png", height: 3215 },
        { key: "yachad", title: "יחד", description: "פלטפורמה שמחברת אנשים למידע ולסיוע מעשי.", category: "פלטפורמה קהילתית", alt: "פלטפורמת יחד עם מידע על טיסות חירום וסיוע קהילתי", visitLabel: "לאתר יחד — נפתח בלשונית חדשה", domain: "yachad.world", href: "https://www.yachad.world/he", image: "/portfolio/yachad.png", height: 2074 },
      ],
    },
    faq: {
      eyebrow: "כמה שאלות טובות",
      title: ["קצת יותר", "בהירות."],
      description: ["לכל עסק יש", "נקודת התחלה משלו."],
      questions: [
        { number: "01", question: "אנחנו רוצים להתחיל עם AI, אבל לא יודעים מאיפה.", answer: "זה מקום מצוין להתחיל ממנו. נכיר את המטרות ואת תהליכי העבודה שלכם, ואז נזהה הזדמנות ממוקדת ששווה לבדוק. אין צורך באפיון טכני או בכלי שכבר בחרתם." },
        { number: "02", question: "אפשר לעבוד עם הכלים שכבר יש לנו?", answer: "מתחילים בהבנת המערכות הקיימות. כשיש גישה ואפשרויות חיבור מתאימות, אפשר לשלב את הכלים שאתם כבר משתמשים בהם. נבדוק התאמה ומגבלות לפני שנמליץ על פתרון." },
        { number: "03", question: "מה יכול לכלול פרויקט פיתוח או AI?", answer: "ההיקף תלוי במטרות שלכם. פרויקט פיתוח מלא יכול לכלול אפיון, עיצוב, פיתוח הממשק והמערכות שמאחוריו, בדיקות ועלייה לאוויר. פרויקט AI יכול לכלול תכנון תהליכים, הטמעה, תיעוד והדרכת צוות. מסכימים מראש על התוצרים ועל תחומי האחריות, לפני שמתחילים." },
        { number: "04", question: "אתם מבטיחים דירוג בחיפוש או אזכור בתשובות AI?", answer: "אין לנו שליטה על הדירוג של מנועי חיפוש או על בחירת המקורות של מערכות AI. אנחנו מתמקדים במה שאפשר לשפר: נגישות טכנית, מידע ברור, תוכן מועיל ושיטת מדידה מתאימה." },
        { number: "05", question: "יש תמיכה גם אחרי העלייה לאוויר?", answer: "אפשר לכלול ליווי ושיפור מתמשך במסגרת העבודה המשותפת. נבין איזו תמיכה דרושה לכם ונסכם אותה כחלק מהיקף הפרויקט." },
      ],
    },
    contact: { eyebrow: "הצעד הבא שלכם", title: ["בואו נהפוך AI", "לכלי שעובד."], description: ["ספרו לנו קצת על העסק שלכם", "ומה הייתם רוצים לשפר.", "נתחיל משם."], email: "info@kohelet.digital" },
    footer: { tagline: ["חשיבה אנושית.", "טכנולוגיה שימושית."], brand: "קהלת", backToTop: "חזרה למעלה" },
  },
};
