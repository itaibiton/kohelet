"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

const languages = [
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-colors text-lg"
        aria-label="Switch language"
      >
        {currentLang.flag}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-colors text-lg"
        aria-label="Switch language"
      >
        {currentLang.flag}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full start-0 mt-2 z-50 w-36 p-1 bg-[#08080a] border border-white/10 rounded-lg shadow-xl">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-start rounded-md transition-colors hover:bg-white/5 ${
                  locale === lang.code ? "text-white bg-white/5" : "text-neutral-400"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
