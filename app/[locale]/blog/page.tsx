"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { posts } from "@/.velite";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { EffectsWrapper } from "@/components/effects/EffectsWrapper";
import { ThreeBackgroundWrapper } from "@/components/effects/ThreeBackgroundWrapper";
import {
  BlogHero,
  BlogFilters,
  BlogGrid,
  type BlogPost,
} from "@/components/sections/blog";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Transform Velite posts to BlogPost interface with locale filtering
 * Posts are already locale-specific from Velite (separate en.mdx/he.mdx files)
 */
function transformPosts(locale: string): BlogPost[] {
  return posts
    .filter((post) => post.locale === locale && post.published)
    .map((post) => ({
      id: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      thumbnail: undefined, // TODO: Add thumbnail support in Phase 3
      author: {
        name: post.author,
        avatar: undefined, // TODO: Add author avatar support in Phase 3
      },
      date: post.date,
      category: post.category,
      slug: post.slug,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage({ params }: Props) {
  const { locale } = React.use(params);

  // Transform Velite posts to BlogPost interface (now locale-filtered)
  const blogPosts = useMemo(() => transformPosts(locale), [locale]);

  // URL params for shareable filtered views
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State management for filters
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    if (category) setActiveCategory(category);
    if (search) {
      setSearchQuery(search);
      setDebouncedSearch(search);
    }
  }, [searchParams]);

  // Sync filters to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (debouncedSearch) params.set("q", debouncedSearch);

    const queryString = params.toString();
    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    );
  }, [activeCategory, debouncedSearch, pathname, router]);

  // Derive unique categories from filtered posts
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  ).sort();

  // Debounced search handler
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(query);
    }, 300);
  }, []);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Category change handler
  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(category);
  }, []);

  // Filter logic with memoization
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === null || post.category === activeCategory;

      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        debouncedSearch === "" ||
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, activeCategory, debouncedSearch]);

  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <EffectsWrapper />
      <ThreeBackgroundWrapper />
      <Navigation />
      <BlogHero />
      <BlogFilters
        categories={categories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />
      <BlogGrid posts={filteredPosts} locale={locale} />
      <Footer />
    </main>
  );
}
