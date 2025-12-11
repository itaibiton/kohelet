export const locales = ['he', 'en'] as const;
export const defaultLocale = 'he' as const;
export type Locale = (typeof locales)[number];

export function isRtl(locale: Locale): boolean {
  return locale === 'he';
}
