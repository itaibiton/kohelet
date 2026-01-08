"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    <section className="w-full max-w-7xl mx-auto px-6 py-4">
      {/* Container with responsive layout - single row on desktop, stacked on mobile */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
        {/* Search Input with Icon */}
        <div className="relative w-full md:max-w-md md:flex-1">
          {/* Search Icon - flips for RTL */}
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none z-10">
            <Search className="w-4 h-4 text-white/40" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={cn(
              // Reset shadcn defaults and apply glassmorphism
              "h-10 w-full",
              "bg-[#111113]/80 backdrop-blur-md",
              "border border-white/10",
              "rounded-lg",
              "text-white placeholder:text-white/40",
              "text-sm",
              // Padding with RTL support for search icon
              "pl-10 pr-4 rtl:pl-4 rtl:pr-10",
              // Focus states
              "focus-visible:border-accent-blue/50 focus-visible:ring-1 focus-visible:ring-accent-blue/20",
              // Transitions
              "transition-all duration-300",
              // Override default shadcn shadow
              "shadow-none"
            )}
          />
        </div>

        {/* Category Select Dropdown */}
        <div className="w-full md:w-auto md:min-w-[200px]">
          <Select
            value={activeCategory ?? "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? null : value)
            }
          >
            <SelectTrigger
              className={cn(
                // Reset shadcn defaults and apply glassmorphism
                "h-10 w-full",
                "bg-[#111113]/80 backdrop-blur-md",
                "border border-white/10",
                "rounded-lg",
                "text-white",
                "text-sm",
                "px-4",
                // Focus states
                "focus-visible:border-accent-blue/50 focus-visible:ring-1 focus-visible:ring-accent-blue/20",
                // Hover state
                "hover:border-white/20 hover:bg-white/[0.04]",
                // Transitions
                "transition-all duration-300",
                // Override default shadcn shadow
                "shadow-none",
                // Chevron icon color
                "[&_svg]:text-white/40"
              )}
            >
              <SelectValue placeholder={t("categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent
              className={cn(
                // Glassmorphism dropdown
                "bg-[#111113]/95 backdrop-blur-xl",
                "border border-white/10",
                "rounded-lg",
                "shadow-xl shadow-black/50",
                // Override default popover colors
                "text-white"
              )}
            >
              {/* All Categories Option */}
              <SelectItem
                value="all"
                className={cn(
                  "text-sm text-white/80",
                  "focus:bg-white/[0.08] focus:text-white",
                  "cursor-pointer",
                  "transition-colors duration-150",
                  // Check icon color
                  "[&_svg]:text-accent-blue"
                )}
              >
                {t("all")}
              </SelectItem>

              {/* Dynamic Category Options */}
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className={cn(
                    "text-sm text-white/80",
                    "focus:bg-white/[0.08] focus:text-white",
                    "cursor-pointer",
                    "transition-colors duration-150",
                    // Check icon color
                    "[&_svg]:text-accent-blue"
                  )}
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

export default BlogFilters;
