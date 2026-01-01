"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Navigation() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const isRTL = locale === "he";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = t.raw("links") as Array<{ label: string; href: string }>;
  const cta = t.raw("cta") as { label: string; href: string };

  return (
    <nav className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
      <div className="glass-panel px-6 py-3 rounded-full flex justify-between items-center gap-8 md:gap-12 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo-vertical-no-digital.svg"
            alt={t("logo")}
            width={32}
            height={32}
            className="w-8 h-8"
          />
          {/* <span className="font-display font-semibold text-sm tracking-tight text-white uppercase">
            {t("logo")}
          </span> */}
        </a>

        {/* Desktop Nav Links */}
        <div className={`hidden md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Desktop CTA */}
        <a
          href={cta.href}
          className={`hidden md:flex items-center gap-2 text-[10px] font-semibold bg-white text-black px-5 py-2 rounded-full hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {cta.label}
          <ArrowRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/70 hover:text-white transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 md:hidden">
          <div className="glass-panel mx-4 p-6 rounded-2xl shadow-2xl">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10">
                <LanguageSwitcher />
              </div>
              <a
                href={cta.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 text-sm font-semibold bg-white text-black px-5 py-3 rounded-full hover:bg-white/90 transition-all mt-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {cta.label}
                <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
