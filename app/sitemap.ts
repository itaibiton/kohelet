import { MetadataRoute } from "next";
import { posts } from "@/.velite";
import { locales } from "@/i18n/config";

const BASE_URL = "https://kohelet.digital";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static pages with their priorities
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "daily" as const },
  ];

  // Generate sitemap entries for static pages (all locales)
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
        ),
      },
    }))
  );

  // Generate sitemap entries for blog posts (per locale)
  // Posts are now locale-specific, so group by slug
  const publishedPosts = posts.filter((post) => post.published);
  const uniqueSlugs = Array.from(new Set(publishedPosts.map((p) => p.slug)));

  const blogEntries: MetadataRoute.Sitemap = uniqueSlugs.flatMap((slug) => {
    // Find posts for this slug (should have en and he versions)
    const slugPosts = publishedPosts.filter((p) => p.slug === slug);
    const mostRecentDate = slugPosts
      .map((p) => new Date(p.date))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      lastModified: mostRecentDate.toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}/blog/${slug}`])
        ),
      },
    }));
  });

  return [...staticEntries, ...blogEntries];
}
