"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// Helper to determine if a link is a pure route link (no hash)
function isRouteLink(href: string): boolean {
  return href.startsWith("/") && !href.includes("#");
}

// Helper to extract hash from href
function getHash(href: string): string | null {
  const hashIndex = href.indexOf("#");
  return hashIndex !== -1 ? href.substring(hashIndex + 1) : null;
}

export function Navigation() {
  const t = useTranslations("navigation");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = t.raw("links") as Array<{ label: string; href: string }>;
  const cta = t.raw("cta") as { label: string; href: string };
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Handle hash link clicks - smooth scroll if on home, navigate if not
  const handleHashClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hash = getHash(href);
      if (!hash) return;

      const isHome = pathname === "/" || pathname === "";

      if (isHome) {
        // Already on home - just scroll
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // On another page - navigate to home with hash
        e.preventDefault();
        router.push(`/#${hash}`);
      }
    },
    [pathname, router]
  );

  return (
    <>
      {/* Language Switcher - Fixed top left (desktop only) */}
      <div className="hidden md:block fixed top-6 start-4 z-[60]">
        <LanguageSwitcher />
      </div>

      <nav className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto px-6 py-3 rounded-full flex justify-between items-center gap-8 md:gap-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-2xl border border-white/10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
            <Image
              src="/logo-vertical-no-digital.svg"
              alt={t("logo")}
              width={32}
              height={32}
              priority
            />
          {/* <span className="font-bold text-sm tracking-tight text-white uppercase">
            {t("logo")}
          </span> */}
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) =>
            isRouteLink(link.href) ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.href)}
                className="text-[11px] font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <a
          href={cta.href}
          onClick={(e) => handleHashClick(e, cta.href)}
          className="hidden md:flex items-center gap-2 text-[10px] font-bold bg-gradient-to-r from-accent-blue to-accent-blue-hover text-white px-5 py-2 rounded-full hover:brightness-110 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          {cta.label}
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
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
        <div className="pointer-events-auto absolute top-full left-4 right-4 mt-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] md:hidden">
          <div className="px-6 py-4 flex flex-col gap-4">
            {/* Language toggle for mobile */}
            <div className="flex items-center gap-4 pb-3 border-b border-white/10">
              <button
                onClick={() => {
                  switchLocale("en");
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-medium py-1 transition-colors ${
                  locale === "en" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                🇺🇸 English
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => {
                  switchLocale("he");
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-medium py-1 transition-colors ${
                  locale === "he" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                🇮🇱 עברית
              </button>
            </div>
            {links.map((link) =>
              isRouteLink(link.href) ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleHashClick(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href={cta.href}
              onClick={(e) => {
                handleHashClick(e, cta.href);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 text-xs font-bold bg-gradient-to-r from-accent-blue to-accent-blue-hover text-white px-5 py-3 rounded-full hover:brightness-110 transition-all mt-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              {cta.label}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

export default Navigation;
