import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import "./landing.css";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-instrument-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kohelet.digital"),
  title: "Kohelet — Make AI work for your business",
  description: "Practical AI search optimization, implementation, automation, and consulting. Build stronger discoverability, connected workflows, and a clear plan with Kohelet.",
  alternates: { canonical: "/codex-landing", languages: { en: "/codex-landing", he: "/he/codex-landing", "x-default": "/codex-landing" } },
  openGraph: { title: "Kohelet — Make AI work for your business", description: "Be found. Work smarter. Move forward. Practical AI services for your business.", url: "/codex-landing", type: "website", locale: "en_US", alternateLocale: "he_IL" },
  icons: { icon: "/favicon.svg" },
  twitter: { card: "summary", title: "Kohelet — Make AI work for your business", description: "Practical AI search optimization, automation, implementation, and consulting for your business." },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" dir="ltr" className={`${manrope.variable} ${instrument.variable}`}><body className="kl-body">{children}</body></html>;
}
