"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

export interface BlogCardProps {
  title: string;
  excerpt: string;
  thumbnail?: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string; // ISO date string
  category: string;
  slug: string;
  locale: string;
}

export function BlogCard({
  title,
  excerpt,
  thumbnail,
  author,
  date,
  category,
  slug,
  locale,
}: BlogCardProps) {
  // Format date based on locale
  const formattedDate = new Date(date).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group relative block rounded-xl overflow-hidden bg-brand-gray/50 backdrop-blur-md border border-white/10 hover:border-accent-blue/30 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Placeholder gradient when no thumbnail
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gray via-brand-surface to-brand-dark">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-sm bg-accent-blue/20" />
              </div>
            </div>
            {/* Decorative grid pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Category Badge */}
        <span className="inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-blue bg-accent-blue/10 border border-accent-blue/20 rounded-full mb-3">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white tracking-tight mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors duration-300">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-4 font-light">
          {excerpt}
        </p>

        {/* Meta: Author & Date */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {/* Author */}
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-3 h-3 text-white/50" />
              </div>
            )}
            <span className="text-xs text-white/60">{author.name}</span>
          </div>

          {/* Separator */}
          <div className="w-1 h-1 rounded-full bg-white/20" />

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-white/40" />
            <span className="text-xs text-white/40">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </Link>
  );
}

export default BlogCard;
