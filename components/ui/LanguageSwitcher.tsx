"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const languages = [
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-colors text-lg"
          aria-label="Switch language"
        >
          {currentLang.flag}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-36 p-1 bg-[#08080a] border border-white/10 rounded-lg shadow-xl"
      >
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
      </PopoverContent>
    </Popover>
  );
}
