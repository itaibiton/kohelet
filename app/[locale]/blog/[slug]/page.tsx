import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import { ThreeBackground } from "@/components/effects/ThreeBackground";
import MouseGlow from "@/components/effects/MouseGlow";
import { MDXContent } from "./mdx-content";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate static params for all blog posts
 * This enables static generation at build time for optimal performance
 */
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate SEO metadata for the blog post
 * Includes locale-aware title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  // Use locale-specific fields if available, fallback to English
  const title = locale === "he" && post.title_he ? post.title_he : post.title;
  const description =
    locale === "he" && post.excerpt_he ? post.excerpt_he : post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      ...(post.thumbnail && { images: [post.thumbnail] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.thumbnail && { images: [post.thumbnail] }),
    },
  };
}

/**
 * Blog Post Page Component
 * Renders individual blog post with MDX content
 */
export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  // Find the post by slug
  const post = allPosts.find((p) => p.slug === slug);

  // Handle 404 - post not found or not published
  if (!post || !post.published) {
    notFound();
  }


  // Use locale-specific fields if available
  const title = locale === "he" && post.title_he ? post.title_he : post.title;
  const category =
    locale === "he" && post.category_he ? post.category_he : post.category;

  // Format date for display
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="min-h-screen relative selection:bg-blue-500/30 selection:text-white">
      <NoiseOverlay />
      <ThreeBackground />
      <MouseGlow />
      <Navigation />

      <article className="relative z-10 pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Post Header */}
          <header className="mb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-neutral-400">
              {post.authorAvatar && (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium text-white">{post.author}</span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <time dateTime={post.date} className="text-sm">
                  {formattedDate}
                </time>
              </div>
            </div>
          </header>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                src={post.thumbnail}
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* MDX Content */}
          <MDXContent content={post.body.raw} locale={locale} />
        </div>
      </article>

      <Footer />
    </main>
  );
}
