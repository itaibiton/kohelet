"use client";

import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/routing";
import type { LandingContent } from "@/content/landing";
import { KoheletLogo } from "./KoheletLogo";

interface HeaderProps {
  brand: LandingContent["brand"];
  nav: LandingContent["nav"];
}

/**
 * Floating pill header (360i style): logo + 4 links on desktop; on mobile the
 * links expand inside the pill under an animated 3-line button. The pill is
 * dark over the hero and flips to ivory once the hero scrolls away.
 */
export function Header({ brand, nav }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const menuId = useId();

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 150);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setTheme(entry.isIntersecting ? "dark" : "light"),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`kd-header${visible ? " is-visible" : ""}${open ? " is-expanded" : ""}`}
      data-theme={theme}
    >
      <nav className="kd-nav" aria-label="Primary">
        <div className="kd-navbar">
          <a href="#top" className="kd-logo-link" aria-label={brand.name}>
            <KoheletLogo className="kd-logo-mark" />
          </a>
          <button
            type="button"
            className="kd-burger"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="kd-burger-line" />
            <span className="kd-burger-line" />
            <span className="kd-burger-line" />
          </button>
        </div>
        <div id={menuId} className={`kd-links${open ? " is-open" : ""}`}>
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} className="kd-link" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link
            href="/"
            locale={nav.switchLocale.locale}
            className="kd-link kd-link--locale"
            aria-label={nav.switchLocale.locale === "en" ? "English" : "עברית"}
          >
            {nav.switchLocale.label}
          </Link>
        </div>
      </nav>
    </header>
  );
}
