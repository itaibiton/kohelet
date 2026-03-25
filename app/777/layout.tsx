import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "../globals.css";
import "./777.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kohelet Digital | דף נחיתה בזק 777 ₪",
  description:
    "דף נחיתה מקצועי, מעוצב וממיר ב-777 ₪ בלבד. 7 ימי עסקים. בול!",
};

export default function Layout777({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} font-sans`}>
      <body className={`${heebo.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
