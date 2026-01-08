"use client";

import { useTranslations } from "next-intl";
import { FileX } from "lucide-react";
import { BlogCard } from "./BlogCard";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  category: string;
  slug: string;
}

export interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-brand-gray/50 backdrop-blur-md border border-white/10">
      {/* Thumbnail skeleton */}
      <div className="aspect-video bg-brand-gray/50 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Category badge skeleton */}
        <div className="w-20 h-6 rounded-full bg-white/5 animate-pulse" />

        {/* Title skeleton */}
        <div className="w-3/4 h-6 rounded bg-white/5 animate-pulse" />

        {/* Excerpt skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded bg-white/5 animate-pulse" />
          <div className="w-full h-4 rounded bg-white/5 animate-pulse" />
        </div>

        {/* Meta skeleton */}
        <div className="pt-4 border-t border-white/5">
          <div className="w-1/2 h-4 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const t = useTranslations("blog.grid");

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="relative p-6 rounded-2xl bg-brand-gray/50 backdrop-blur-md border border-white/10">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-50 rounded-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Icon container */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <FileX className="w-8 h-8 text-white/40" />
          </div>

          {/* Text content */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">
              {t("emptyState")}
            </h3>
            <p className="text-sm text-white/50 max-w-xs font-light">
              {t("emptyStateDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogGrid({ posts, locale, isLoading = false }: BlogGridProps) {
  // Show loading skeleton state
  if (isLoading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 0.1, 0.6)}s` }}
            >
              <SkeletonCard />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show empty state when no posts
  if (posts.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmptyState />
        </div>
      </section>
    );
  }

  // Render blog post grid with staggered animation
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index * 0.1, 0.6)}s` }}
          >
            <BlogCard
              title={post.title}
              excerpt={post.excerpt}
              thumbnail={post.thumbnail}
              author={post.author}
              date={post.date}
              category={post.category}
              slug={post.slug}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogGrid;
