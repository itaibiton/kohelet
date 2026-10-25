import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Landing from "@/app/codex-landing/Landing";
import "@/app/codex-landing/landing.css";

export const metadata: Metadata = {
  title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם",
  description: "פיתוח אפליקציות ואתרים, קידום בחיפוש ובמנועי AI, אוטומציה וייעוץ. קהלת בונה פתרונות דיגיטליים לעסק, משלב הרעיון ועד העלייה לאוויר.",
  alternates: { canonical: "/he/codex-landing", languages: { en: "/codex-landing", he: "/he/codex-landing", "x-default": "/codex-landing" } },
  openGraph: { title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם", description: "אפליקציות, אתרים, בינה מלאכותית ואוטומציה. כלים דיגיטליים שנבנים סביב העסק שלכם.", url: "/he/codex-landing", type: "website", locale: "he_IL", alternateLocale: "en_US" },
  twitter: { card: "summary", title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם", description: "פיתוח אפליקציות ואתרים, קידום בחיפוש ובמערכות AI, אוטומציה וייעוץ בהתאמה לעסק שלכם." },
};

export default async function HebrewLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "en") redirect("/codex-landing");
  if (locale !== "he") notFound();
  return <Landing locale="he" />;
}
