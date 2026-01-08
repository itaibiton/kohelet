"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

/**
 * Mock blog post data for initial development.
 * This will be replaced with real data from CMS/database in future iterations.
 */
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Web Applications with Next.js",
    excerpt:
      "Learn how to build performant, scalable web applications using Next.js 14 and React Server Components.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2024-01-15",
    category: "Development",
    slug: "building-scalable-web-apps-nextjs",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    excerpt:
      "Explore how artificial intelligence is transforming the way we build and interact with web applications.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2024-01-10",
    category: "AI & Automation",
    slug: "future-of-ai-web-development",
  },
  {
    id: "3",
    title: "Creating Engaging User Experiences",
    excerpt:
      "Discover design principles and techniques for crafting intuitive and delightful user interfaces.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2024-01-05",
    category: "Design",
    slug: "creating-engaging-user-experiences",
  },
  {
    id: "4",
    title: "Growth Marketing Strategies for Tech Startups",
    excerpt:
      "Proven marketing tactics to scale your tech startup and acquire customers efficiently.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2023-12-28",
    category: "Marketing",
    slug: "growth-marketing-strategies-tech-startups",
  },
  {
    id: "5",
    title: "Case Study: Transforming Enterprise Workflows",
    excerpt:
      "How we helped a Fortune 500 company modernize their legacy systems and improve productivity by 300%.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2023-12-20",
    category: "Case Study",
    slug: "case-study-transforming-enterprise-workflows",
  },
  {
    id: "6",
    title: "Building a Data-Driven Business Culture",
    excerpt:
      "Learn how to leverage analytics and insights to make better business decisions and drive growth.",
    thumbnail: undefined,
    author: {
      name: "Kohelet Team",
      avatar: undefined,
    },
    date: "2023-12-15",
    category: "Business",
    slug: "building-data-driven-business-culture",
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default function BlogPage({ params }: Props) {
  const { locale } = React.use(params);

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

  // Derive unique categories from mock posts
  const categories = Array.from(
    new Set(mockPosts.map((post) => post.category))
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

  // Category change handler
  const handleCategoryChange = useCallback((category: string | null) => {
    setActiveCategory(category);
  }, []);

  // Filter logic with memoization
  const filteredPosts = useMemo(() => {
    return mockPosts.filter((post) => {
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
  }, [activeCategory, debouncedSearch]);

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
