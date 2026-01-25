import { posts, authors } from "@/.velite";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import { MDXContent } from "./mdx-content";
import { AuthorProfile } from "@/components/blog/author-profile";
import {
  getArticleSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  jsonLdScriptProps,
} from "@/lib/schema";

// FAQ data for MVP article (for featured snippets)
const mvpFaqsHe = [
  {
    question: "כמה זמן לוקח לפתח MVP?",
    answer: "4-8 שבועות למרבית הפרויקטים. MVP פשוט (לנדינג פייג' + טופס) לוקח 1-2 שבועות, MVP סטנדרטי (אפליקציית web) לוקח 4-6 שבועות, ו-MVP מורכב עם אינטגרציות רבות לוקח 8-12 שבועות.",
  },
  {
    question: "כמה עולה לפתח MVP?",
    answer: "טווח המחירים בישראל: לנדינג פייג' ואימות עולה ₪8,000-₪15,000, אפליקציית web בסיסית עולה ₪30,000-₪80,000, ו-MVP מלא עם אפליקציה עולה ₪80,000-₪180,000. MVP טוב חוסך 60-70% מעלות פיתוח מוצר מלא.",
  },
  {
    question: "האם אני צריך להיות טכני כדי לבנות MVP?",
    answer: "לא. אתם צריכים להבין את הלקוחות ואת הבעיה. מה שצריך: ראייה ברורה של מה המוצר עושה, יכולת לתקשר את החזון, זמן להיות מעורב בתהליך, ושותף טכני או חברת פיתוח שאתם סומכים עליהם.",
  },
  {
    question: "מה ההבדל בין MVP לאבטיפוס?",
    answer: "אבטיפוס = הדגמה. MVP = מוצר אמיתי, מינימלי. אבטיפוס מיועד להדגים רעיון למשקיעים או צוות עם פונקציונליות מוגבלת, בעוד MVP מיועד לבדוק שוק עם לקוחות אמיתיים ופונקציונליות אמיתית.",
  },
  {
    question: "איך אני יודע אם ה-MVP שלי מצליח?",
    answer: "מדדים קריטיים: Activation Rate (כמה משתמשים משלימים פעולה ראשונה), Retention (כמה חוזרים אחרי שבוע/חודש), NPS (האם ממליצים לחברים), Conversion (כמה עוברים לתשלום), ו-Engagement. אם 40%+ מהמשתמשים יהיו מאוכזבים מאוד אם המוצר ייעלם - אתם על הדרך הנכונה.",
  },
  {
    question: "מה עושים אחרי השקת ה-MVP?",
    answer: "3 מסלולים אפשריים: Scale (הרחבה) - אם המוצר עובד, הוסיפו תכונות ושיווק; Iterate (שיפור) - אם הכיוון נכון אבל צריך שיפורים; Pivot (שינוי כיוון) - אם הרעיון המקורי לא עובד. תמיד נתחו את הנתונים ודברו עם משתמשים לפני ההחלטה.",
  },
];

const mvpFaqsEn = [
  {
    question: "How long does it take to develop an MVP?",
    answer: "4-8 weeks for most projects. A simple MVP (landing page + form) takes 1-2 weeks, a standard MVP (basic web application) takes 4-6 weeks, and a complex MVP with many integrations takes 8-12 weeks.",
  },
  {
    question: "How much does it cost to develop an MVP?",
    answer: "Price ranges: Landing page + validation costs $2,000-$5,000, basic web application costs $8,000-$25,000, and full MVP with mobile app costs $25,000-$50,000. A good MVP saves 60-70% of full product development costs.",
  },
  {
    question: "Do I need to be technical to build an MVP?",
    answer: "No. You need to understand your customers and the problem. What you do need: clear vision of what the product does, ability to communicate the vision, time to be involved in the process, and a technical partner or development company you trust.",
  },
  {
    question: "What's the difference between an MVP and a Prototype?",
    answer: "Prototype = demonstration. MVP = real product, minimal. A prototype is meant to demonstrate an idea to investors or team with limited functionality, while an MVP is meant to test the market with real customers and real functionality.",
  },
  {
    question: "How do I know if my MVP is successful?",
    answer: "Critical metrics: Activation Rate (how many users complete a first action), Retention (how many return after a week/month), NPS (would they recommend to friends), Conversion (how many go from free to paid), and Engagement. If 40%+ of users would be very disappointed if the product disappeared - you're on the right track.",
  },
  {
    question: "What do you do after launching the MVP?",
    answer: "3 possible paths: Scale - if the product works, add features and marketing; Iterate - if direction is right but needs improvements; Pivot - if the original idea doesn't work. Always analyze the data and talk to users before deciding.",
  },
];

const BASE_URL = "https://kohelet.digital";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts
 * Generate for both locales since posts are now separate per locale
 */
export async function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({
      locale: post.locale,
      slug: post.slug,
    }));
}

/**
 * Generate SEO metadata for the blog post
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = posts.find((p) => p.slug === slug && p.locale === locale);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

/**
 * Blog Post Page Component
 * Renders individual blog post with MDX content from Velite
 */
export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  // Find the post by slug AND locale (posts are now locale-specific)
  const post = posts.find((p) => p.slug === slug && p.locale === locale);

  // Handle 404 - post not found or not published
  if (!post || !post.published) {
    notFound();
  }

  // Look up author profile
  const author = authors.find(a => a.id === post.author);

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Generate structured data for SEO and AI engines
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/${locale}/blog/${post.slug}`,
    datePublished: post.date,
    author: post.author,
    image: undefined, // TODO: Add thumbnail support in Phase 3
    locale,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: locale === "he" ? "דף הבית" : "Home", url: `${BASE_URL}/${locale}` },
    { name: locale === "he" ? "בלוג" : "Blog", url: `${BASE_URL}/${locale}/blog` },
    { name: post.title, url: `${BASE_URL}/${locale}/blog/${post.slug}` },
  ]);

  // Add FAQ schema for articles with FAQs (MVP article)
  const schemas: object[] = [articleSchema, breadcrumbSchema];
  if (slug === "mvp-4-week-sprint-guide") {
    const faqSchema = getFAQSchema(locale === "he" ? mvpFaqsHe : mvpFaqsEn);
    schemas.push(faqSchema);
  }

  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <script {...jsonLdScriptProps(schemas)} />
      <EffectsWrapper />
      <ThreeBackgroundWrapper />
      <Navigation />

      <article className="relative z-10 pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Post Header */}
          <header className="mb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-neutral-400">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium text-white">{post.author}</span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <time dateTime={post.date} className="text-sm">
                  {formattedDate}
                </time>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="text-sm">
                  {post.metadata.readingTime} {locale === "he" ? "דקות קריאה" : "min read"}
                </span>
              </div>
            </div>
          </header>

          {/* Author Profile */}
          {author && (
            <AuthorProfile
              name={author.name}
              bio={author.bio}
              avatar={author.avatar}
              locale={locale}
            />
          )}

          {/* MDX Content - now using Velite's compiled output */}
          <MDXContent code={post.content} locale={locale} />
        </div>
      </article>

      <Footer />
    </main>
  );
}
