"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export interface BlogFiltersProps {
  categories: string[];
  activeCategory: string | null;
  searchQuery: string;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (query: string) => void;
}

export function BlogFilters({
  categories,
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: BlogFiltersProps) {
  const t = useTranslations("blog.filters");

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Container with responsive layout */}
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-white/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-11 pr-4 py-3 bg-brand-gray/50 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder:text-white/40 text-sm transition-all duration-300 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {/* "All" chip */}
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
              activeCategory === null
                ? "border-accent-blue/50 bg-accent-blue/10 text-accent-blue"
                : "border-white/10 bg-brand-gray/30 text-white/60 hover:border-white/20 hover:bg-brand-gray/50"
            }`}
          >
            {t("all")}
          </button>

          {/* Category chips */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "border-accent-blue/50 bg-accent-blue/10 text-accent-blue"
                  : "border-white/10 bg-brand-gray/30 text-white/60 hover:border-white/20 hover:bg-brand-gray/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogFilters;
