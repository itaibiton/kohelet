"use client";

import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";

export interface BlogPostHeaderProps {
  title: string;
  title_he?: string;
  category: string;
  category_he?: string;
  author: string;
  authorAvatar?: string;
  date: string; // ISO date string
  locale: string;
  readingTime?: number; // in minutes
}

export function BlogPostHeader({
  title,
  title_he,
  category,
  category_he,
  author,
  authorAvatar,
  date,
  locale,
  readingTime,
}: BlogPostHeaderProps) {
  // Determine locale-aware content
  const isHebrew = locale === "he";
  const displayTitle = isHebrew && title_he ? title_he : title;
  const displayCategory = isHebrew && category_he ? category_he : category;

  // Format date based on locale
  const formattedDate = new Date(date).toLocaleDateString(
    isHebrew ? "he-IL" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Format reading time
  const readingTimeText = readingTime
    ? isHebrew
      ? `${readingTime} ${readingTime === 1 ? "דקה" : "דקות"} קריאה`
      : `${readingTime} min read`
    : null;

  return (
    <header className="relative w-full rounded-2xl overflow-hidden bg-[#111113]/80 backdrop-blur-md border border-white/10 p-6 md:p-8 lg:p-10">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-blue bg-accent-blue/10 border border-accent-blue/20 rounded-full mb-6">
          {displayCategory}
        </span>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-semibold tracking-tighter leading-[1.15] text-white text-start mb-8">
          {displayTitle}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-6 border-t border-white/10">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={author}
                width={32}
                height={32}
                className="rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-white/50" />
              </div>
            )}
            <span className="text-sm text-white/80 font-medium">{author}</span>
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            <span className="text-sm text-white/60">{formattedDate}</span>
          </div>

          {/* Reading Time */}
          {readingTimeText && (
            <>
              {/* Separator */}
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/60">{readingTimeText}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
    </header>
  );
}

export default BlogPostHeader;
