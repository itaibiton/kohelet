import type { Metadata } from "next";
import { Inter, Syne, Alef } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isRtl, type Locale } from "@/i18n/config";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-syne",
});

const alef = Alef({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-hebrew",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const meta = messages.meta as { title: string; description: string };

  return {
    title: meta?.title || "Kohelet | Digital Solutions & AI Architects",
    description:
      meta?.description ||
      "We engineer high-performance software ecosystems with AI integration.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";
  const isHebrew = locale === "he";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`scroll-smooth ${inter.variable} ${syne.variable} ${alef.variable}`}
    >
      <body
        className={`${isHebrew ? alef.className : inter.className} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
