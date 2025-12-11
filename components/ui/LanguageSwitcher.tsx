"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { ChevronRightIcon, GlobeIcon } from "@/components/icons";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "he", label: "עברית", flag: "🇮🇱" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-sm"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="uppercase tracking-widest">{currentLang.code}</span>
        <ChevronRightIcon
          size={12}
          className={`transition-transform duration-300 ${isOpen ? "rotate-90 rtl:-rotate-90" : "rtl:rotate-180"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full end-0 mt-2 w-32 bg-[#08080a] border border-white/10 rounded-sm shadow-xl overflow-hidden py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-xs text-start transition-colors hover:bg-white/5 ${locale === lang.code ? "text-white bg-white/5" : "text-neutral-400"
                }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
