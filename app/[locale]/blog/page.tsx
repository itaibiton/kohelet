"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import { ThreeBackground } from "@/components/effects/ThreeBackground";
import MouseGlow from "@/components/effects/MouseGlow";
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
 * Transform Contentlayer posts to BlogPost interface with locale-aware fields
 */
function transformPosts(locale: string): BlogPost[] {
  const isHebrew = locale === "he";

  return allPosts
    .filter((post) => post.published !== false) // Filter only published posts
    .map((post) => ({
      id: post.slug,
      title: isHebrew && post.title_he ? post.title_he : post.title,
      excerpt: isHebrew && post.excerpt_he ? post.excerpt_he : post.excerpt,
      thumbnail: post.thumbnail,
      author: {
        name: post.author,
        avatar: post.authorAvatar,
      },
      date: post.date,
      category: isHebrew && post.category_he ? post.category_he : post.category,
      slug: post.slug,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending (newest first)
}

export default function BlogPage({ params }: Props) {
  const { locale } = React.use(params);

  // Transform Contentlayer posts to BlogPost interface
  const posts = useMemo(() => transformPosts(locale), [locale]);

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

  // Derive unique categories from real posts
  const categories = Array.from(
    new Set(posts.map((post) => post.category))
  ).sort();

  // Debounced search handler
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query); // Update input immediately for UI

    // Debounce the filter update
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
    return posts.filter((post) => {
      // Category filter
      const matchesCategory =
        activeCategory === null || post.category === activeCategory;

      // Search filter (case-insensitive, matches title and excerpt)
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        debouncedSearch === "" ||
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, debouncedSearch]);

  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <NoiseOverlay />
      <ThreeBackground />
      <MouseGlow />
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
