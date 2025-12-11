"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "he" ? "en" : "he";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-700 rounded-md bg-neutral-900/50 backdrop-blur-sm"
      aria-label={locale === "he" ? "Switch to English" : "עבור לעברית"}
    >
      {locale === "he" ? "EN" : "עב"}
    </button>
  );
}
