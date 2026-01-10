import type { Metadata } from "next";
import { Heebo, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isRtl, type Locale } from "@/i18n/config";
import { PricingProvider } from "@/context/PricingContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/favicon.svg",
    },
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

  return (
    <html lang={locale} dir={dir} className={`scroll-smooth ${heebo.variable} font-sans`}>
      <body
        className={`${heebo.className} ${jetbrainsMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <PricingProvider>
            {children}
          </PricingProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
