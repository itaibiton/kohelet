"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";

interface MDXContentProps {
  code: string;
  locale: string;
}

/**
 * Client Component for rendering MDX content
 * Separated from the main page to keep the page as a Server Component
 */
export function MDXContent({ code, locale }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-white
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl prose-pre:shadow-xl
        prose-ul:text-neutral-300 prose-ul:my-6
        prose-ol:text-neutral-300 prose-ol:my-6
        prose-li:my-2
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-400
        prose-img:rounded-xl prose-img:shadow-2xl"
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <Component />
    </div>
  );
}
