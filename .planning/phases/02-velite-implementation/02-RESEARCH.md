# Phase 2: Velite Implementation - Research

**Researched:** 2026-01-25
**Domain:** Content management with MDX, build-time processing, TypeScript type generation
**Confidence:** HIGH

## Summary

Velite is a modern, actively-maintained content processing tool that turns Markdown/MDX files into type-safe data layers using Zod schema validation. It is the recommended replacement for the abandoned Contentlayer project and works seamlessly with Next.js 16's Turbopack (unlike Contentlayer which relies on webpack plugins).

**Key findings:**
- Velite v0.3.1 (latest, December 2025) is production-ready and actively maintained
- Built-in support for MDX, reading time computation, slug generation, and TypeScript type generation
- Works with Turbopack via programmatic API (critical for Next.js 16.1.4 compatibility)
- Simple migration path from Contentlayer with similar API patterns
- Native support for rehype/remark plugins already in use (rehype-highlight, rehype-slug, rehype-autolink-headings, remark-gfm)

**Primary recommendation:** Use Velite's programmatic API with Next.js config for Turbopack compatibility, implement custom locale extraction via schema transforms for the bilingual folder structure.

## Standard Stack

The established libraries/tools for Velite-based MDX content management:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| velite | 0.3.1 | Build-time content processing | Official successor to Contentlayer, actively maintained, framework-agnostic |
| zod | Latest | Schema validation | Required by Velite, provides TypeScript type inference |
| @shikijs/rehype | Latest | Syntax highlighting | Recommended by Velite docs, modern replacement for rehype-highlight |
| rehype-slug | 6.0.0 | Heading IDs | Already in use, direct compatibility |
| rehype-autolink-headings | 7.1.0 | Heading anchors | Already in use, direct compatibility |
| remark-gfm | 4.0.1 | GitHub-flavored Markdown | Already in use, direct compatibility |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rehype-highlight | 7.0.2 | Code highlighting (alternative) | If sticking with current approach instead of Shiki |
| @shikijs/transformers | Latest | Line numbers, highlighting | When advanced code block features needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Velite | Content Collections | More Next.js-specific, less framework-agnostic |
| Velite | fumadocs | Documentation-focused, not general content |
| @shikijs/rehype | rehype-pretty-code | More styling flexibility but requires more configuration |

**Installation:**
```bash
npm install velite zod
# Optional: upgrade to Shiki (recommended)
npm install @shikijs/rehype shiki
# Keep existing plugins
npm install rehype-slug rehype-autolink-headings remark-gfm
```

## Architecture Patterns

### Recommended Project Structure
```
content/
├── blog/
│   ├── {slug}/
│   │   ├── en.mdx        # English version
│   │   └── he.mdx        # Hebrew version
├── ...
.velite/                   # Generated (gitignored)
├── index.js              # ESM exports
├── index.d.ts            # TypeScript types
└── posts.json            # Collection data
velite.config.ts          # Velite configuration
```

### Pattern 1: Velite Configuration for Bilingual Content
**What:** Define collections with custom schema transforms to extract locale from file path
**When to use:** Folder-based locale structure ({slug}/en.mdx, {slug}/he.mdx)
**Example:**
```typescript
// Source: Based on Velite official docs + community patterns
import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'
import remarkGfm from 'remark-gfm'

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      excerpt: s.string().max(999),
      date: s.isodate(),
      author: s.string(),
      category: s.string(),
      published: s.boolean().default(true),
      metadata: s.metadata(), // Auto-generates readingTime & wordCount
      content: s.mdx(),
    })
    .transform((data, { meta }) => {
      // Extract slug from folder name and locale from filename
      const pathParts = meta.path.split('/')
      const fileName = pathParts[pathParts.length - 1] // e.g., "en.mdx"
      const folderName = pathParts[pathParts.length - 2] // e.g., "mvp-4-week-sprint-guide"
      const locale = fileName.replace('.mdx', '') // "en" or "he"

      return {
        ...data,
        slug: folderName,
        locale: locale,
        url: `/${locale}/blog/${folderName}`,
      }
    }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeShiki, { theme: 'one-dark-pro' }],
    ],
  },
})
```

### Pattern 2: Next.js Integration with Turbopack
**What:** Use programmatic API instead of webpack plugin for Turbopack compatibility
**When to use:** Always with Next.js 16+ (Turbopack is default bundler)
**Example:**
```typescript
// Source: https://velite.js.org/guide/with-nextjs
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Velite integration for Turbopack
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

const nextConfig: NextConfig = {
  // ... existing config
}

export default withNextIntl(nextConfig)
```

### Pattern 3: TypeScript Configuration
**What:** Configure paths for generated types
**When to use:** Always with TypeScript projects
**Example:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      ".velite": ["./.velite"]
    }
  },
  "include": [
    ".velite"
  ]
}
```

### Pattern 4: Consuming Generated Content
**What:** Import type-safe collections in Next.js pages
**When to use:** When rendering blog posts, listings, etc.
**Example:**
```typescript
// Source: https://velite.js.org/guide/with-nextjs
import { posts } from '@/.velite'

// Filter by locale
export async function generateStaticParams() {
  return posts
    .filter(post => post.locale === 'en' && post.published)
    .map(post => ({ slug: post.slug }))
}

export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug && p.locale === 'en')

  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <div>Reading time: {post.metadata.readingTime} min</div>
      {/* MDX component rendering */}
    </article>
  )
}
```

### Anti-Patterns to Avoid
- **Using VeliteWebpackPlugin:** Breaks with Turbopack, use programmatic API instead
- **Not gitignoring .velite:** Generated files should not be committed (bloat, merge conflicts)
- **Hardcoding locale in schema:** Extract from file path for flexibility
- **Skipping metadata extraction:** Built-in s.metadata() is more accurate than custom reading time

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reading time calculation | Word count ÷ 200 WPM | `s.metadata()` | Accounts for code blocks, punctuation, language differences |
| Slug generation | Path parsing logic | `s.path()` or transform | Handles edge cases, unicode, special characters |
| MDX compilation | Custom remark/rehype pipeline | `s.mdx()` | Handles imports, JSX scope, optimization |
| Schema validation | Manual frontmatter checks | Zod schemas via Velite | Type inference, clear error messages, validation at build time |
| Type generation | Manual type definitions | Velite auto-generation | Always in sync, no drift between content and types |
| Code highlighting | Client-side Prism/Highlight.js | rehype plugins (Shiki) | Better performance (build-time), smaller bundle, no layout shift |

**Key insight:** Content processing has many edge cases (Unicode slugs, special characters, code blocks affecting reading time, MDX imports). Velite's built-in schemas handle these correctly.

## Common Pitfalls

### Pitfall 1: Webpack Plugin with Turbopack
**What goes wrong:** Using `VeliteWebpackPlugin` in Next.js 16+ causes build failures
**Why it happens:** Turbopack is not fully compatible with webpack ecosystem, plugin doesn't run
**How to avoid:** Use programmatic API in next.config.ts with top-level await
**Warning signs:** Build errors mentioning webpack, plugin not found errors

### Pitfall 2: Forgetting to Start Velite in Development
**What goes wrong:** Content changes don't reflect in dev server, stale data
**Why it happens:** Velite needs to watch files and rebuild on changes
**How to avoid:** Ensure `build({ watch: isDev })` is in next.config.ts
**Warning signs:** Editing MDX files doesn't trigger updates, content outdated

### Pitfall 3: Not Cleaning Output Between Builds
**What goes wrong:** Deleted content still appears, stale files in .velite
**Why it happens:** Velite doesn't clean output by default
**How to avoid:** Set `clean: !isDev` in build options (clean on production builds)
**Warning signs:** Deleted posts still showing, old slugs working

### Pitfall 4: Incorrect Locale Extraction Logic
**What goes wrong:** Posts assigned to wrong locale or fail to match
**Why it happens:** Path parsing assumes specific structure, breaks if structure changes
**How to avoid:** Use robust path parsing with error handling, log extracted locale in dev
**Warning signs:** Posts not appearing in correct locale, 404s on valid slugs

### Pitfall 5: Missing TypeScript Path Alias
**What goes wrong:** Import errors, can't find '@/.velite' module
**Why it happens:** TypeScript doesn't know where to find generated files
**How to avoid:** Configure paths in tsconfig.json to point to .velite directory
**Warning signs:** TypeScript errors on imports, IDE autocomplete not working

### Pitfall 6: Committing Generated Files
**What goes wrong:** Merge conflicts, bloated repo, outdated generated files
**Why it happens:** .velite directory not in .gitignore
**How to avoid:** Add `.velite` and `public/static` to .gitignore immediately
**Warning signs:** Git showing hundreds of changed files, large diffs on trivial content changes

## Code Examples

Verified patterns from official sources:

### Computing Reading Time Automatically
```typescript
// Source: https://velite.js.org/guide/velite-schemas
const posts = defineCollection({
  schema: s.object({
    content: s.mdx(),
    metadata: s.metadata(), // Returns { readingTime: number, wordCount: number }
  })
})

// Usage in component
<p>{post.metadata.readingTime} min read</p>
```

### Extracting Slug from Folder Name
```typescript
// Source: https://velite.js.org/guide/define-collections
const posts = defineCollection({
  schema: s
    .object({
      title: s.string(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => {
      // meta.path = "content/blog/mvp-4-week-sprint-guide/en.mdx"
      const pathParts = meta.path.split('/')
      const folderName = pathParts[pathParts.length - 2]
      const fileName = pathParts[pathParts.length - 1]
      const locale = fileName.replace('.mdx', '')

      return {
        ...data,
        slug: folderName,
        locale: locale,
      }
    })
})
```

### Filtering Posts by Locale
```typescript
// Source: https://velite.js.org/examples/nextjs
import { posts } from '@/.velite'

// In page component
const locale = 'en'
const publishedPosts = posts.filter(
  post => post.locale === locale && post.published
)

// Sort by date
const sortedPosts = publishedPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)
```

### Rendering MDX Content
```typescript
// Source: https://velite.js.org/other/snippets
import { MDXContent } from '@/components/mdx-content'

export default function PostPage({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <MDXContent code={post.content} />
    </article>
  )
}

// components/mdx-content.tsx
'use client'
import * as runtime from 'react/jsx-runtime'

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component />
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer | Velite | March 2024 | Contentlayer unmaintained, Velite actively developed |
| rehype-highlight | @shikijs/rehype | 2024-2025 | Better themes, smaller bundle, more features |
| Webpack plugin integration | Programmatic API | Oct 2025 (Next.js 16) | Required for Turbopack compatibility |
| Runtime MDX compilation | Build-time with Velite | Current standard | Better performance, smaller bundles |
| Manual reading time | s.metadata() | Velite introduction | More accurate, accounts for code blocks |

**Deprecated/outdated:**
- **Contentlayer:** Last update 7+ months ago, not maintained, use Velite
- **VeliteWebpackPlugin:** Breaks with Turbopack, use programmatic API
- **Client-side syntax highlighting:** Use build-time rehype plugins instead

## Open Questions

Things that couldn't be fully resolved:

1. **Locale filtering in Velite vs Next.js**
   - What we know: Velite processes all files, filtering happens in Next.js code
   - What's unclear: Whether Velite can output separate collections per locale
   - Recommendation: Filter in Next.js (simpler, more flexible) but investigate if performance becomes issue

2. **MDX component scope for bilingual content**
   - What we know: Custom components can be passed to MDXContent
   - What's unclear: Best pattern for locale-aware components (e.g., CTA buttons with locale links)
   - Recommendation: Pass locale as prop to MDXContent wrapper, provide via context to custom components

3. **Handling needsTranslation flag**
   - What we know: Some posts have needsTranslation: true in frontmatter
   - What's unclear: Should this affect published status, or just be metadata?
   - Recommendation: Keep as metadata field, filter separately from published flag for flexibility

## Sources

### Primary (HIGH confidence)
- [Velite Official Documentation - Introduction](https://velite.js.org/guide/introduction) - Core concepts and features
- [Velite Official Documentation - Define Collections](https://velite.js.org/guide/define-collections) - Schema patterns
- [Velite Official Documentation - Next.js Integration](https://velite.js.org/guide/with-nextjs) - Turbopack-compatible setup
- [Velite Official Documentation - Velite Schemas](https://velite.js.org/guide/velite-schemas) - s.metadata(), s.mdx(), etc.
- [Velite Official Documentation - Configuration](https://velite.js.org/reference/config) - All config options
- [Velite Official Documentation - Code Highlighting](https://velite.js.org/guide/code-highlighting) - Rehype plugin setup
- [Velite GitHub Repository](https://github.com/zce/velite) - v0.3.1 release info, 725 stars

### Secondary (MEDIUM confidence)
- [ContentLayer Alternatives - Wisp CMS](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) - Migration context, Contentlayer abandonment
- [Refactoring ContentLayer to Velite - Mike van Peeren](https://www.mikevpeeren.nl/blog/refactoring-contentlayer-to-velite) - Real migration experience
- [Integrating Velite in Next.js Blog - nooc.me](https://nooc.me/en/posts/integrate-a-blog-in-nextjs-with-velite) - Integration patterns
- [Velite Library Introduction - witch.work](https://witch.work/en/posts/velite-library-introduction) - Community guide

### Tertiary (LOW confidence)
- WebSearch results for "Velite bilingual i18n" - Community discussions, no official pattern yet
- WebSearch results for "Velite common pitfalls" - No specific results, inferred from general content management pitfalls

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs verified, v0.3.1 confirmed, rehype/remark plugins documented
- Architecture: HIGH - Official patterns for Next.js integration, transform examples verified
- Pitfalls: MEDIUM - Turbopack issue documented officially, others inferred from migration articles
- Bilingual pattern: MEDIUM - Transform pattern verified, specific locale extraction is custom implementation
- Migration steps: HIGH - Official docs + community migration articles consistent

**Research date:** 2026-01-25
**Valid until:** ~2026-02-25 (30 days - Velite is stable, Next.js 16 is current)

**Notes:**
- Next.js 16.1.4 is confirmed compatible with Velite via programmatic API
- Existing rehype/remark plugins (rehype-highlight, rehype-slug, rehype-autolink-headings, remark-gfm) are directly compatible
- Consider upgrading to @shikijs/rehype for better code highlighting (optional, not required)
- Bilingual folder structure ({slug}/en.mdx + he.mdx) requires custom transform but is straightforward
