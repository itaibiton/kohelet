"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { mdxComponents } from "@/components/mdx/MDXComponents";

export interface BlogPostContentProps {
  code: string; // post.body.code from Contentlayer
}

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
