"use client";

import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/routing";
import type { LandingContent } from "@/content/landing";

interface HeaderProps {
  brand: LandingContent["brand"];
  nav: LandingContent["nav"];
}

export function Header({ brand, nav }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="kd-header">
        <div className="flex items-center justify-between gap-6 px-[var(--kd-gutter)] py-5">
          <a
            href="#top"
            className="text-xl font-black tracking-tight"
            aria-label={brand.name}
          >
            {brand.name}
            <span aria-hidden="true">.</span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {nav.links.map((link) => (
              <a key={link.href} href={link.href} className="kd-nav-link">
                {link.label}
              </a>
            ))}
            <Link
              href="/"
              locale={nav.switchLocale.locale}
              className="kd-nav-link"
              aria-label={nav.switchLocale.locale === "en" ? "English" : "עברית"}
            >
              {nav.switchLocale.label}
            </Link>
          </nav>

          <button
            type="button"
            className="kd-burger md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id={menuId}
        className="kd-menu md:hidden"
        data-open={open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/"
            locale={nav.switchLocale.locale}
            tabIndex={open ? 0 : -1}
            className="mt-6 text-base! font-bold! tracking-normal! opacity-70"
          >
            {nav.switchLocale.locale === "en" ? "English" : "עברית"}
          </Link>
        </nav>
        <p className="mt-10 text-sm text-white/60">{brand.tagline}</p>
      </div>
    </>
  );
}
