"use client";

import { Check, ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import type { LandingLocale } from "./landing-copy";

const languages = [
  { locale: "en", label: "English", flag: "🇺🇸", href: "/codex-landing" },
  { locale: "he", label: "עברית", flag: "🇮🇱", href: "/he/codex-landing" },
] as const;

export default function LanguageMenu({ locale, label }: { locale: LandingLocale; label: string }) {
  const current = languages.find((language) => language.locale === locale)!;

  return (
    <DropdownMenu.Root dir={locale === "he" ? "rtl" : "ltr"} modal={false}>
      <DropdownMenu.Trigger className="kl-language-trigger" aria-label={`${label}: ${current.label}`}>
        <span className="kl-language-flag" aria-hidden="true">{current.flag}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="kl-language-menu" align="end" sideOffset={8} collisionPadding={16} aria-label={label}>
        {languages.map((language) => (
          <DropdownMenu.Item asChild key={language.locale}>
            <a
              className="kl-language-option"
              href={language.href}
              hrefLang={language.locale}
              lang={language.locale}
              aria-current={language.locale === locale ? "page" : undefined}
            >
              <span className="kl-language-flag" aria-hidden="true">{language.flag}</span>
              <span>{language.label}</span>
              {language.locale === locale && <Check className="kl-language-check" size={15} aria-hidden="true" />}
            </a>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
