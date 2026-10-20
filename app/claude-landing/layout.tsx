import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import "./claude-landing.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--cl-font-body",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--cl-font-display",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--cl-font-mono",
  weight: ["400", "500"],
});

const TITLE = "Kohelet — Make AI work for your business";
const DESCRIPTION =
  "Kohelet is an independent AI consultancy. We help businesses get found in search and AI answers, remove repetitive work with practical automation, and make clearer decisions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kohelet.digital"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/claude-landing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/claude-landing",
    siteName: "Kohelet Digital",
    images: [
      {
        url: "/api/og?title=Make%20AI%20work%20for%20your%20business",
        width: 1200,
        height: 630,
        alt: "Kohelet — Make AI work for your business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  width: "device-width",
  initialScale: 1,
};

export default function ClaudeLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${interTight.variable} ${mono.variable}`}
    >
      <body className="antialiased" style={{ background: "#0b0c0f" }}>
        {children}
      </body>
    </html>
  );
}
