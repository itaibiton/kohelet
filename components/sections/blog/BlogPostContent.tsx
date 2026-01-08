"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import type { ComponentPropsWithoutRef } from "react";

interface BlogPostContentProps {
  code: string; // post.body.code from Contentlayer
}

/**
 * Custom MDX components for styling blog post content
 * These components provide consistent typography and styling
 * that matches the glassmorphism design system
 */
const mdxComponents = {
  // Headings
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl md:text-4xl font-bold text-white mb-6 mt-10 first:mt-0 tracking-tight"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl md:text-3xl font-semibold text-white mb-4 mt-10 first:mt-0 tracking-tight"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl md:text-2xl font-medium text-white mb-3 mt-8 first:mt-0"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="text-lg md:text-xl font-medium text-white mb-3 mt-6 first:mt-0"
      {...props}
    />
  ),
  h5: (props: ComponentPropsWithoutRef<"h5">) => (
    <h5
      className="text-base md:text-lg font-medium text-white mb-2 mt-4 first:mt-0"
      {...props}
    />
  ),
  h6: (props: ComponentPropsWithoutRef<"h6">) => (
    <h6
      className="text-sm md:text-base font-medium text-white/90 mb-2 mt-4 first:mt-0"
      {...props}
    />
  ),

  // Paragraph
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="text-white/70 leading-relaxed mb-5 text-base md:text-lg"
      {...props}
    />
  ),

  // Links
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-accent-blue hover:text-accent-blue-hover underline underline-offset-4 decoration-accent-blue/30 hover:decoration-accent-blue transition-colors duration-200"
      {...props}
    />
  ),

  // Inline code
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-white/5 px-1.5 py-0.5 rounded text-sm font-mono text-accent-blue border border-white/10"
      {...props}
    />
  ),

  // Code blocks (pre contains code for syntax highlighted blocks)
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-[#0a0a0b] border border-white/10 rounded-xl p-4 md:p-5 overflow-x-auto my-6 text-sm md:text-base font-mono [&>code]:bg-transparent [&>code]:p-0 [&>code]:border-0 [&>code]:text-inherit"
      {...props}
    />
  ),

  // Lists
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc text-white/70 space-y-2 mb-5 ml-6 marker:text-accent-blue/60"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal text-white/70 space-y-2 mb-5 ml-6 marker:text-accent-blue/60"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed pl-1" {...props} />
  ),

  // Blockquote
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-accent-blue/50 pl-5 py-1 italic text-white/60 my-6 bg-accent-blue/5 rounded-r-lg pr-4"
      {...props}
    />
  ),

  // Horizontal rule
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className="border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-10"
      {...props}
    />
  ),

  // Text emphasis
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-white/80" {...props} />
  ),

  // Images
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-xl my-6 w-full h-auto border border-white/10"
      alt={props.alt || ""}
      {...props}
    />
  ),

  // Tables
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse border border-white/10 rounded-xl overflow-hidden"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-white/5" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="divide-y divide-white/10" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-white/10 last:border-0" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-white/10 last:border-r-0"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="px-4 py-3 text-sm text-white/70 border-r border-white/10 last:border-r-0"
      {...props}
    />
  ),
};

/**
 * BlogPostContent Component
 *
 * A client component that renders MDX content for individual blog posts.
 * Uses the useMDXComponent hook from next-contentlayer2/hooks to render
 * the compiled MDX code with custom styled components.
 *
 * The content is wrapped in a glassmorphism container that matches
 * the design system's visual language.
 */
export function BlogPostContent({ code }: BlogPostContentProps) {
  const MDXContent = useMDXComponent(code);

  return (
    <article className="relative w-full rounded-2xl overflow-hidden bg-[#111113]/80 backdrop-blur-md border border-white/10 p-6 md:p-10">
      {/* Subtle gradient background for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-transparent pointer-events-none" />

      {/* MDX Content with custom components */}
      <div className="relative z-10 prose prose-invert max-w-none">
        <MDXContent components={mdxComponents} />
      </div>

      {/* Bottom accent line for visual continuity with header */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
    </article>
  );
}

export default BlogPostContent;
