import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Landing from "@/app/codex-landing/Landing";
import "@/app/codex-landing/landing.css";

export const metadata: Metadata = {
  title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם",
  description: "קידום בחיפוש ובמנועי AI, הטמעת בינה מלאכותית ואוטומציה, ייעוץ והדרכת צוותים. קהלת מחברת בין הטכנולוגיה לצרכים של העסק שלכם.",
  alternates: { canonical: "/he/codex-landing", languages: { en: "/codex-landing", he: "/he/codex-landing", "x-default": "/codex-landing" } },
  openGraph: { title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם", description: "יותר נראות, פחות עבודה חוזרת ותוכנית פעולה ברורה לעסק שלכם.", url: "/he/codex-landing", type: "website", locale: "he_IL", alternateLocale: "en_US" },
  twitter: { card: "summary", title: "קהלת — בינה מלאכותית שעובדת בשביל העסק שלכם", description: "קידום בחיפוש, הטמעת AI ואוטומציה, ייעוץ והדרכת צוותים — בשפה ברורה ובהתאמה לעסק שלכם." },
};

export default async function HebrewLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "en") redirect("/codex-landing");
  if (locale !== "he") notFound();
  return <Landing locale="he" />;
}
