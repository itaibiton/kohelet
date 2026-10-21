import Link from "next/link";
import { getLocale } from "next-intl/server";
import { defaultLocale, isRtl, locales, type Locale } from "@/i18n/config";

const copy = {
  he: {
    title: "המאמר לא נמצא",
    description: "לא ניתן למצוא את המאמר המבוקש.",
    backToBlog: "חזרה לבלוג",
  },
  en: {
    title: "Post Not Found",
    description: "The requested blog post could not be found.",
    backToBlog: "Back to Blog",
  },
};

export default async function ArticleNotFound() {
  const requestedLocale = await getLocale();
  const locale: Locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;
  const text = copy[locale];

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-6 text-center text-white"
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
    >
      <title>{text.title}</title>
      <meta name="description" content={text.description} />
      <p className="font-mono text-sm text-blue-400" aria-hidden="true">404</p>
      <h1 className="text-3xl font-semibold md:text-4xl">{text.title}</h1>
      <p className="max-w-md text-neutral-300">{text.description}</p>
      <Link
        href={`/${locale}/blog`}
        className="mt-3 rounded-full bg-blue-600 px-6 py-3 font-medium transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        {text.backToBlog}
      </Link>
    </main>
  );
}
