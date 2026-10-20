"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav } from "./content";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className="cl-nav"
      data-scrolled={scrolled ? "true" : "false"}
      data-open={open ? "true" : "false"}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-full"
          aria-label="Kohelet, back to top"
        >
          <Image
            src="/logo-vertical-no-digital.svg"
            alt=""
            width={28}
            height={28}
            priority
          />
          <span
            className="text-[15px] font-medium tracking-tight"
            style={{ fontFamily: "var(--cl-display)" }}
          >
            Kohelet
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="cl-nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={nav.cta.href} className="cl-btn cl-btn-primary cl-btn-small">
            {nav.cta.label}
          </a>
          <button
            type="button"
            className="cl-menu-icon flex h-10 w-10 flex-col items-center justify-center gap-[4px] rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="cl-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="cl-mobile-menu"
            className="md:hidden"
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(-6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{
              opacity: 0,
              transform: reduce ? "none" : "translateY(-4px)",
              transition: { duration: 0.15, ease: EASE_OUT },
            }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-5 pt-1">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-xl px-3 py-3 text-base"
                    style={{ color: "var(--cl-ink)" }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
