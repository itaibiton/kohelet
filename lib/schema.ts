/**
 * JSON-LD Schema Utilities for SEO and GEO (Generative Engine Optimization)
 *
 * These schemas help search engines and AI answer engines understand
 * the content and structure of the website.
 */

const BASE_URL = "https://kohelet.digital";

// Organization Schema - Company information for knowledge graph
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Kohelet Digital",
    alternateName: "קהלת דיגיטל",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/favicon.svg`,
      width: 512,
      height: 512,
    },
    description:
      "Business automation and custom software development company specializing in AI agents, workflow automation, and web/mobile applications.",
    foundingDate: "2019",
    founders: [
      {
        "@type": "Person",
        name: "Yonatan Levi",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tel Aviv",
      addressCountry: "IL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+972-52-341-0467",
      contactType: "sales",
      email: "info@kohelet.digital",
      availableLanguage: ["English", "Hebrew"],
    },
    sameAs: [
      // Add social media profiles when available
      // "https://linkedin.com/company/kohelet-digital",
      // "https://twitter.com/kohelet_digital",
    ],
    // Keywords and topics for AI understanding
    knowsAbout: [
      "Business Automation",
      "AI Agents",
      "Custom Software Development",
      "Web Application Development",
      "Mobile App Development",
      "Workflow Automation",
      "Next.js",
      "React",
      "Node.js",
    ],
  };
}

// WebSite Schema - Site-wide information and search
export function getWebSiteSchema(locale: string = "en") {
  const name = locale === "he" ? "קהלת דיגיטל" : "Kohelet Digital";
  const description =
    locale === "he"
      ? "אוטומציה עסקית ופיתוח תוכנה מותאם"
      : "Business Automation & Custom Software Development";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: `${BASE_URL}/${locale}`,
    name,
    description,
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: locale === "he" ? "he-IL" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${locale}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Service Schema - For each service offered
export interface ServiceSchemaInput {
  name: string;
  description: string;
  serviceType: string;
  locale?: string;
}

export function getServiceSchema(service: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    // Link to known concepts for AI trust
    about: [
      {
        "@type": "Thing",
        name: service.serviceType,
      },
    ],
  };
}

// Article Schema - For blog posts
export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  locale?: string;
}

export function getArticleSchema(article: ArticleSchemaInput) {
  const locale = article.locale || "en";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": article.url,
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    image: article.image
      ? {
          "@type": "ImageObject",
          url: article.image,
        }
      : undefined,
    inLanguage: locale === "he" ? "he-IL" : "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };
}

// BreadcrumbList Schema - For navigation hierarchy
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQPage Schema - For FAQ sections
export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// LocalBusiness Schema - For local SEO (if applicable)
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Kohelet Digital",
    image: `${BASE_URL}/favicon.svg`,
    url: BASE_URL,
    telephone: "+972-52-341-0467",
    email: "info@kohelet.digital",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tel Aviv",
      addressCountry: "IL",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [],
  };
}

// Helper to create JSON-LD script tag content
export function jsonLdScriptProps(schema: object | object[]) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema, null, 0),
    },
  };
}
