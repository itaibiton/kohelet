"use client";

import React from "react";
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

  // Placeholder state - will be replaced with useState in FE-02
  // These are hardcoded for now since BlogFilters expects these props
  const activeCategory = null;
  const searchQuery = "";

  // Derive unique categories from mock posts
  const categories = Array.from(
    new Set(mockPosts.map((post) => post.category))
  ).sort();

  // Filter logic (placeholder - will be enhanced in FE-02)
  // For now, just pass all posts through
  const filteredPosts = mockPosts;

  // Placeholder handlers - will be implemented in FE-02
  const handleCategoryChange = () => {
    // TODO: Implement in FE-02
  };

  const handleSearchChange = () => {
    // TODO: Implement in FE-02
  };

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
