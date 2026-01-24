# Architecture Research: Blog Integration with Next.js 16 and next-intl

**Project:** Kohelet Digital Blog System
**Researched:** 2026-01-24
**Confidence:** MEDIUM-HIGH

## Executive Summary

The project currently uses **Contentlayer2** (a maintained fork) to process MDX blog content, but faces two critical integration challenges:

1. **Single-file multilingual pattern** - Current approach stores both languages in one MDX file with `title_he`/`excerpt_he` fields, limiting content flexibility
2. **Contentlayer maintenance risk** - Using a community fork of an abandoned project introduces long-term maintenance concerns

**Recommended path:** Migrate to **separate file-per-locale** architecture using either Velite (Contentlayer-like) or native App Router patterns (more future-proof).

---

## Current Architecture Analysis

### Existing Structure

```
content/blog/
  ├── building-modern-websites-nextjs.mdx  (single file, dual language)
  ├── ai-powered-development-workflow.mdx
  └── ...

app/[locale]/blog/
  ├── page.tsx                              (blog index)
  └── [slug]/
      └── page.tsx                          (uses contentlayer/generated)
```

### Current Flow

1. **Build time:** Contentlayer2 processes MDX files → generates TypeScript types
2. **Runtime:** `allPosts` imported from `contentlayer/generated`
3. **Locale handling:** Runtime switching based on `title_he`, `excerpt_he` fields
4. **Static generation:** `generateStaticParams()` returns slugs from `allPosts`

### Issues with Current Approach

| Issue | Impact | Priority |
|-------|--------|----------|
| Single file contains both languages | Limited body content translation | HIGH |
| Contentlayer2 is community fork | Maintenance risk, uncertain future | MEDIUM |
| No locale-specific routes | Can't have `/he/blog/slug-he` + `/en/blog/slug-en` | LOW |
| Frontmatter duplication | `title`/`title_he` pattern doesn't scale | MEDIUM |

---

## Recommended Architecture

### Option A: Separate Files per Locale (Recommended)

**Structure:**
```
content/blog/
  ├── building-modern-websites-nextjs/
  │   ├── en.mdx
  │   └── he.mdx
  ├── ai-powered-development/
  │   ├── en.mdx
  │   └── he.mdx
  └── ...
```

**Rationale:**
- True content independence per locale
- Simpler frontmatter (no `_he` suffixes)
- Easier for content creators (clear separation)
- Aligns with next-intl philosophy (locale-first)

**Implementation options:**

#### Option A1: Velite (Contentlayer-like, Modern)

**Why Velite:**
- Direct Contentlayer replacement with similar API
- Actively maintained (released 2024-2026)
- TypeScript type generation like Contentlayer
- Zod-based validation
- Better performance than Contentlayer

**Configuration:**
```typescript
// velite.config.ts
import { defineConfig, s } from 'velite'

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'blog/**/*.mdx',
      schema: s.object({
        title: s.string(),
        excerpt: s.string(),
        date: s.isodate(),
        author: s.string(),
        category: s.string(),
        locale: s.enum(['en', 'he']),  // explicit locale
        slug: s.slug('title'),
        metadata: s.metadata(),
        content: s.mdx(),
      })
    }
  }
})
```

**Usage in page:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
import { posts } from '#site/content'

export async function generateStaticParams() {
  return posts.map(post => ({
    locale: post.locale,
    slug: post.slug
  }))
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params
  const post = posts.find(p => p.slug === slug && p.locale === locale)
  // ...
}
```

#### Option A2: Native App Router with fs/promises (No Library)

**Why Native:**
- No external dependencies for content layer
- Full control over processing pipeline
- Future-proof (only depends on Node.js and Next.js)
- Lighter bundle

**Implementation:**
```typescript
// lib/blog.ts
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const BLOG_DIR = join(process.cwd(), 'content/blog')

export async function getAllPosts(locale: string) {
  const slugs = await readdir(BLOG_DIR)

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const path = join(BLOG_DIR, slug, `${locale}.mdx`)
      const source = await readFile(path, 'utf-8')
      const { data: frontmatter } = matter(source)

      return {
        slug,
        ...frontmatter,
        locale
      }
    })
  )

  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getPost(slug: string, locale: string) {
  const path = join(BLOG_DIR, slug, `${locale}.mdx`)
  const source = await readFile(path, 'utf-8')

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight, rehypeSlug]
      }
    }
  })

  return { content, frontmatter, slug, locale }
}
```

**Usage in page:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
import { getAllPosts, getPost } from '@/lib/blog'

export async function generateStaticParams() {
  const locales = ['en', 'he']
  const params = []

  for (const locale of locales) {
    const posts = await getAllPosts(locale)
    params.push(...posts.map(post => ({
      locale,
      slug: post.slug
    })))
  }

  return params
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params
  const { content, frontmatter } = await getPost(slug, locale)

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      {content}
    </article>
  )
}
```

---

## Integration with next-intl

### URL Structure

Both options support next-intl's locale routing:

```
/he/blog                    → Blog index (Hebrew)
/en/blog                    → Blog index (English)
/he/blog/mvp-guide          → Post in Hebrew
/en/blog/mvp-guide          → Post in English
```

### Route Structure

```
app/
  └── [locale]/
      ├── layout.tsx          (existing: NextIntlClientProvider)
      └── blog/
          ├── page.tsx        (blog index, queries by locale)
          └── [slug]/
              └── page.tsx    (post page, queries by slug + locale)
```

### Key Integration Points

1. **Params are async** (Next.js 16):
   ```typescript
   const { locale, slug } = await params
   ```

2. **Locale validation** (from existing layout.tsx):
   ```typescript
   if (!routing.locales.includes(locale as Locale)) {
     notFound()
   }
   ```

3. **Messages/translations** (existing pattern):
   ```typescript
   const messages = await getMessages()
   ```

4. **generateStaticParams** must return locale combinations:
   ```typescript
   export async function generateStaticParams() {
     // Return all locale + slug combinations
     return [
       { locale: 'he', slug: 'mvp-guide' },
       { locale: 'en', slug: 'mvp-guide' },
       // ...
     ]
   }
   ```

---

## SEO & Schema Integration

### Metadata Generation Pattern (Preserved from Current)

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale)

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        'he': `${BASE_URL}/he/blog/${slug}`,
        'en': `${BASE_URL}/en/blog/${slug}`,
      }
    },
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      alternateLocale: locale === 'he' ? 'en_US' : 'he_IL',
    }
  }
}
```

### Schema Markup (Using Existing lib/schema.ts)

```typescript
// In page component
const articleSchema = getArticleSchema({
  title: post.title,
  description: post.excerpt,
  url: `${BASE_URL}/${locale}/blog/${slug}`,
  datePublished: post.date,
  author: post.author,
  image: post.thumbnail,
  locale,
})

const breadcrumbSchema = getBreadcrumbSchema([
  { name: locale === 'he' ? 'דף הבית' : 'Home', url: `${BASE_URL}/${locale}` },
  { name: locale === 'he' ? 'בלוג' : 'Blog', url: `${BASE_URL}/${locale}/blog` },
  { name: post.title, url: `${BASE_URL}/${locale}/blog/${slug}` },
])

return (
  <main>
    <script {...jsonLdScriptProps([articleSchema, breadcrumbSchema])} />
    {/* content */}
  </main>
)
```

**No changes needed to lib/schema.ts** - existing functions already handle locale parameter.

---

## Build Process

### Static Generation Flow

1. **Content scan** (build time):
   - Read all files from `content/blog/**/*.mdx`
   - Parse frontmatter for metadata
   - Generate slug list per locale

2. **generateStaticParams** (build time):
   - Return all `{ locale, slug }` combinations
   - Next.js pre-renders each page

3. **Content compilation** (per page, build time):
   - Read locale-specific MDX file
   - Compile with remark/rehype plugins
   - Generate React components

4. **Type safety**:
   - **Velite:** Auto-generates types from schema
   - **Native:** Manual TypeScript interfaces

### Build Commands

**Current:**
```json
{
  "scripts": {
    "contentlayer": "contentlayer2 build",
    "build": "npm run contentlayer && next build"
  }
}
```

**With Velite:**
```json
{
  "scripts": {
    "velite": "velite",
    "build": "velite && next build"
  }
}
```

**With Native:**
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

---

## Migration Path & Implementation Order

### Phase 1: Content Restructure (No Code Changes)

1. **Create new folder structure**:
   ```bash
   mkdir content/blog/building-modern-websites-nextjs
   ```

2. **Split existing MDX files**:
   - Extract English content → `en.mdx`
   - Extract Hebrew content → `he.mdx`
   - Remove `_he` suffix from frontmatter

3. **Verify both files have complete content**

**Estimated effort:** 2-3 hours (5 posts)

### Phase 2: Choose & Install Content Layer

**Decision point:** Velite vs Native

**Velite (recommended if staying close to Contentlayer):**
```bash
npm uninstall contentlayer2 @contentlayer2/source-files
npm install velite
```

**Native (recommended for long-term simplicity):**
```bash
npm install next-mdx-remote gray-matter
npm install -D @types/mdx
```

**Estimated effort:** 1 hour

### Phase 3: Update Content Loading

1. **Create content utilities** (`lib/blog.ts`):
   - `getAllPosts(locale)` - list all posts for locale
   - `getPost(slug, locale)` - get single post with compiled MDX

2. **Update `generateStaticParams`**:
   - Loop over locales
   - Return all combinations

3. **Update blog index page** (`app/[locale]/blog/page.tsx`):
   - Use `getAllPosts(locale)`

4. **Update blog post page** (`app/[locale]/blog/[slug]/page.tsx`):
   - Use `getPost(slug, locale)`
   - Render compiled MDX

**Estimated effort:** 4-6 hours

### Phase 4: Update Schema & Metadata

1. **Update `generateMetadata`**:
   - Add `alternates.languages` for locale switching
   - Use per-locale title/excerpt

2. **Test schema markup**:
   - Verify Article schema
   - Verify Breadcrumb schema
   - Test with Google Rich Results Test

**Estimated effort:** 2 hours

### Phase 5: Testing & Verification

1. **Build verification**:
   ```bash
   npm run build
   ```

2. **Test all routes**:
   - `/he/blog` - Hebrew index
   - `/en/blog` - English index
   - `/he/blog/mvp-guide` - Hebrew post
   - `/en/blog/mvp-guide` - English post

3. **SEO verification**:
   - Check `<link rel="alternate" hreflang="he">`
   - Validate schema markup
   - Test OpenGraph tags

**Estimated effort:** 2 hours

---

## Architecture Patterns

### Pattern 1: Locale-First Content Loading

**What:** Always pass locale to content functions, never fetch all locales at once.

**When:** Every content query

**Example:**
```typescript
// Good
const posts = await getAllPosts(locale)

// Avoid
const allPosts = await getAllPosts()
const filteredPosts = allPosts.filter(p => p.locale === locale)
```

**Why:** Reduces memory usage, clearer intent, better for i18n.

### Pattern 2: Consistent Slug Across Locales

**What:** Use the same slug for both languages, only file differs.

**When:** URL structure design

**Example:**
```
content/blog/mvp-guide/
  ├── en.mdx  → /en/blog/mvp-guide
  └── he.mdx  → /he/blog/mvp-guide
```

**Why:**
- Simpler locale switching (keep slug, change locale)
- Easier to implement `alternates.languages` in metadata
- Users can manually switch locale in URL

### Pattern 3: Frontmatter Validation

**What:** Validate required fields at build time, fail fast.

**Example (Velite):**
```typescript
schema: s.object({
  title: s.string().min(1).max(100),
  excerpt: s.string().min(10).max(300),
  date: s.isodate(),
  published: s.boolean().default(true),
})
```

**Example (Native + Zod):**
```typescript
import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  excerpt: z.string().min(10).max(300),
  date: z.string().datetime(),
  published: z.boolean().default(true),
})

export async function getPost(slug: string, locale: string) {
  const source = await readFile(path, 'utf-8')
  const { data } = matter(source)

  const frontmatter = frontmatterSchema.parse(data)  // Throws if invalid
  // ...
}
```

**Why:** Catch content errors at build time, not runtime.

### Pattern 4: Async Params (Next.js 16)

**What:** Route params are Promises in Next.js 16 App Router.

**Example:**
```typescript
// Next.js 15 (old)
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
}

// Next.js 16 (current)
export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

**Why:** Aligns with async route handling, prepares for future Next.js features.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Runtime Locale Switching in Single File

**What:** Storing both languages in one MDX file, switching at render time.

**Why bad:**
- Frontmatter explosion (`title`, `title_he`, `excerpt`, `excerpt_he`)
- Body content can't be fully translated
- Harder for content creators to edit
- Breaks i18n best practices

**Instead:** Separate files per locale (recommended architecture).

### Anti-Pattern 2: Client-Side MDX Compilation

**What:** Using `@mdx-js/mdx` or similar to compile MDX in browser.

**Why bad:**
- Large bundle size (~50KB+ for compiler)
- Slow runtime performance
- No static generation benefits
- Security risks if source is user-generated

**Instead:** Server-side compilation with `next-mdx-remote/rsc` or Velite.

### Anti-Pattern 3: Mixing Content Sources

**What:** Some posts in MDX files, others in CMS, others in database.

**Why bad:**
- Inconsistent schema validation
- Multiple content pipelines to maintain
- Type safety gaps
- Deployment complexity

**Instead:** Standardize on one content source (MDX files for this project).

### Anti-Pattern 4: Forgetting Dynamic Params Config

**What:** Not setting `export const dynamicParams = false` when all routes are known.

**Why bad:**
- Unknown slugs return 200 instead of 404
- Potential infinite route generation
- Confusing 404 behavior

**Instead:**
```typescript
export const dynamicParams = false  // All posts defined in generateStaticParams
```

---

## Performance Considerations

### Static Generation (Recommended)

All blog routes are known at build time:

```typescript
export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  // Generate all locale + slug combinations
}
```

**Benefits:**
- ~10ms response time (static file)
- No server compute per request
- Optimal Core Web Vitals
- Works with any hosting (CDN, S3, etc.)

### Incremental Static Regeneration (ISR)

If posts update frequently:

```typescript
export const revalidate = 3600  // Revalidate every hour
```

**Trade-offs:**
- Requires Node.js runtime (not static export)
- More complex cache invalidation
- Not needed for this use case (posts rarely change)

### Image Optimization

Use Next.js `<Image>` for post thumbnails:

```typescript
import Image from 'next/image'

<Image
  src={post.thumbnail}
  alt={post.title}
  width={1200}
  height={630}
  priority={false}
/>
```

**Current approach** (existing code uses `<img>`) should migrate to `<Image>` for:
- Automatic WebP/AVIF conversion
- Responsive sizes
- Lazy loading

---

## Scalability Considerations

### At 10 Posts (Current)

| Approach | Build Time | Type Safety | DX |
|----------|------------|-------------|-----|
| Contentlayer2 | ~5s | Excellent | Good |
| Velite | ~3s | Excellent | Good |
| Native | ~2s | Manual | Fair |

**Recommendation:** Any approach works fine.

### At 100 Posts

| Approach | Build Time | Type Safety | DX |
|----------|------------|-------------|-----|
| Contentlayer2 | ~30s | Excellent | Good |
| Velite | ~15s | Excellent | Good |
| Native | ~8s | Manual | Fair |

**Recommendation:** Velite pulls ahead on build performance.

### At 1000 Posts

| Approach | Build Time | Type Safety | DX |
|----------|------------|-------------|-----|
| Contentlayer2 | ~5min | Excellent | Good |
| Velite | ~2min | Excellent | Good |
| Native | ~1min | Manual | Fair |

**Recommendation:** Native approach becomes attractive at scale, but requires more engineering for type safety.

**Reality check:** This blog unlikely to exceed 50-100 posts. Build time not a concern.

---

## Recommendation Summary

### Recommended Approach: **Native App Router + next-mdx-remote/rsc**

**Rationale:**

1. **Future-proof:** No external content layer dependency
2. **Simple:** ~100 lines of code for all content logic
3. **Maintained:** Depends only on Next.js and Node.js
4. **Flexible:** Easy to extend for special cases
5. **Lightweight:** No extra build step
6. **Type-safe enough:** Manual interfaces sufficient for 10-50 posts

### When to Choose Velite Instead:

- Planning 100+ posts (build performance matters)
- Multiple content types (blog + docs + changelog)
- Need Zod validation for frontmatter
- Prefer Contentlayer-like DX

### Never Choose:

- **Contentlayer2:** Community fork of abandoned project, uncertain future
- **@next/mdx:** Treats MDX as pages, not data (wrong paradigm)

---

## Next Steps for Roadmap

Based on this research, recommended phase structure:

### Phase 1: Content Migration
- **Goal:** Restructure content files (no code changes)
- **Effort:** 2-3 hours
- **Risk:** Low (reversible)

### Phase 2: Content Layer Implementation
- **Goal:** Replace Contentlayer2 with native approach
- **Effort:** 6-8 hours
- **Risk:** Medium (requires testing)
- **Dependencies:** Phase 1 complete

### Phase 3: Integration Testing
- **Goal:** Verify all routes, SEO, schema markup
- **Effort:** 2-3 hours
- **Risk:** Low
- **Dependencies:** Phase 2 complete

### Phase 4: Deployment Verification
- **Goal:** Test build, verify production behavior
- **Effort:** 1 hour
- **Risk:** Low
- **Dependencies:** Phase 3 complete

**Total estimated effort:** 11-14 hours (1.5-2 days)

---

## Open Questions & Research Flags

### Resolved
- ✓ How to structure content for next-intl? → Separate files per locale
- ✓ What happens to Contentlayer? → Abandoned, fork exists (contentlayer2)
- ✓ Best MDX library for App Router? → next-mdx-remote/rsc
- ✓ How to handle static generation? → generateStaticParams with locale loops

### Needs Validation
- **MDX component customization:** Current code has `mdx-content.tsx` - need to verify custom component API with next-mdx-remote
- **Existing schema markup:** Verify all schema functions work with per-locale content
- **Image paths:** Current MDX uses relative image paths - need to verify resolution with new structure

### Out of Scope (For Future Phases)
- MDX search functionality (requires separate implementation)
- Blog pagination (current design assumes single page)
- RSS feed generation (not in milestone scope)
- Reading time estimation (nice-to-have)

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| App Router patterns | HIGH | Official Next.js docs + existing codebase |
| next-intl integration | MEDIUM-HIGH | Official redirect, course content paywalled |
| MDX processing | HIGH | Multiple verified sources, clear patterns |
| Contentlayer status | HIGH | GitHub issues confirm abandonment |
| Velite as alternative | MEDIUM | Recent release, growing adoption |
| Native approach | HIGH | Standard Node.js + Next.js patterns |
| Build performance | MEDIUM | Extrapolated from community reports |

**Overall confidence:** MEDIUM-HIGH

Strong confidence in recommended architecture (separate files + native approach). Medium confidence in Velite specifics (newer tool, less battle-tested).

---

## Sources

### High Confidence (Official Documentation)
- [Next.js App Router MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official MDX integration patterns
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Static generation with dynamic routes
- [next-intl Routing](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing.mdx) - Locale routing patterns

### Medium Confidence (Community & Comparisons)
- [Contentlayer Maintenance Status](https://github.com/contentlayerdev/contentlayer/issues/429) - Project abandonment confirmation
- [Contentlayer Alternatives Analysis](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) - Velite and other alternatives
- [Contentlayer2 Fork](https://github.com/timlrx/contentlayer2) - Community-maintained version
- [Building MDX Blog with Next.js](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx) - App Router patterns
- [Refactoring Contentlayer to Velite](https://www.mikevpeeren.nl/blog/refactoring-contentlayer-to-velite) - Migration patterns

### Low Confidence (WebSearch Only)
- [next-intl MDX Documentation](https://learn.next-intl.dev/chapters/07-content/06-markdown) - Course material (paywalled)
- [Building Modern Blog with Next.js 16](https://www.mdxblog.io/code/building-a-modern-blog-with-mdx-and-nextjs-16) - Recent patterns

### Context from Existing Codebase (HIGH Confidence)
- `/Users/Kohelet/Code/kohelet/app/[locale]/layout.tsx` - Existing next-intl setup
- `/Users/Kohelet/Code/kohelet/lib/schema.ts` - Schema generation utilities
- `/Users/Kohelet/Code/kohelet/contentlayer.config.ts` - Current Contentlayer2 config
- `/Users/Kohelet/Code/kohelet/app/[locale]/blog/[slug]/page.tsx` - Current blog post implementation
