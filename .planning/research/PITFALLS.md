# Pitfalls Research: Blog System Migration

**Project:** Kohelet Digital Blog
**Migration:** contentlayer2 → Modern MDX System
**Researched:** 2026-01-24
**Confidence:** HIGH

## Executive Summary

Migrating from contentlayer2 to a modern MDX system in Next.js 16 with Turbopack and bilingual support presents several critical pitfalls. The most dangerous are: (1) Turbopack plugin serialization issues, (2) RTL/LTR text direction conflicts, (3) metadata generation performance bottlenecks, and (4) static export limitations with dynamic routes.

This research identifies 23 specific pitfalls across four categories: migration-specific, bilingual/RTL, Turbopack compatibility, and SEO/metadata issues.

---

## Critical Pitfalls

### Pitfall 1: Turbopack Plugin Serialization Failure

**What happens:**
When running `next dev --turbo`, the dev server crashes with error: "loader does not have serializable options. Ensure that options passed are plain JavaScript objects and values." MDX files fail to compile, blocking development entirely.

**Root cause:**
Turbopack cannot serialize function references in loader options. The entire MDX/remark/rehype ecosystem uses functions for plugins, creating a fundamental incompatibility when plugins are passed as `require()` or imported functions.

**Warning signs:**
- Dev server works with `next dev` but fails with `next dev --turbo`
- Error message mentions "serializable options"
- Using remark/rehype plugins in `next.config.js`

**Prevention:**
```javascript
// BAD - Causes serialization error
remarkPlugins: [require('remark-gfm'), remarkGemoji]

// GOOD - Use string references
remarkPlugins: ['remark-gfm', 'remark-gemoji']

// For plugins with options, this may not work - see Phase warning
rehypePlugins: [
  'rehype-slug',
  // This approach has limitations with complex options
]
```

**Consequences if ignored:**
- Cannot use Turbopack for development (major performance loss)
- Must disable Turbopack entirely or remove MDX plugins
- Build process slower, dev experience degraded

**Phase to address:** Phase 1 (Setup) - Must configure correctly from the start
**Deeper research needed:** YES - String-based plugin configuration may not support complex options like `rehypeAutolinkHeadings` with custom behavior. Need to verify all plugin configurations work with string references.

### Pitfall 2: Mixed RTL/LTR Content Direction Conflicts

**What happens:**
When Hebrew (RTL) and English (LTR) text mix within the same paragraph or MDX component, punctuation appears in wrong locations, URLs break mid-word, and inline code blocks render backwards. The browser's bidirectional algorithm produces unpredictable results.

**Root cause:**
HTML's bidirectional text algorithm treats neutral characters (punctuation, numbers, URLs) as part of the surrounding directional context. When an RTL paragraph contains English product names or code snippets, the browser makes incorrect directional assumptions.

**Warning signs:**
- Punctuation appearing at start of line instead of end
- URLs breaking with text reversed: `moc.elpmaxe//:sptth`
- Code snippets reading right-to-left when they should be LTR
- Dates formatted incorrectly (e.g., "2026-01-24" becomes "24-01-2026")

**Prevention:**
```typescript
// Wrap LTR content in RTL paragraphs with explicit direction
<p dir="rtl">
  טקסט בעברית עם <span dir="ltr">English phrase</span> המשך בעברית
</p>

// For code blocks in RTL content
<p dir="rtl">
  להשתמש ב-<code dir="ltr">useState</code> לניהול מצב
</p>

// URLs must be wrapped
<p dir="rtl">
  בקר באתר <a href="..." dir="ltr">https://example.com</a> למידע נוסף
</p>
```

**Alternative using CSS (NOT recommended):**
Avoid using `unicode-bidi` and `direction` CSS properties for base direction. CSS can be overridden and causes more problems than it solves. Use HTML `dir` attribute.

**Consequences if ignored:**
- Blog posts unreadable in Hebrew
- Professional credibility damaged (looks broken)
- SEO impact (search engines may misinterpret content)
- Users copy-paste broken text

**Phase to address:** Phase 2 (MDX Processing) - Need custom MDX components with direction-aware wrappers
**Deeper research needed:** NO - Solution is well-established, use HTML `dir` attribute

### Pitfall 3: generateMetadata Performance Bottleneck

**What happens:**
Page rendering completely blocks until `generateMetadata()` finishes. If metadata generation involves slow operations (file system reads, complex computations, external API calls), Time to First Byte (TTFB) increases dramatically, killing Core Web Vitals scores.

**Root cause:**
Next.js waits for metadata before streaming any content. The page won't render until `generateMetadata` completes. For MDX blogs reading frontmatter from disk, this means every page load waits for file I/O.

**Warning signs:**
- TTFB > 600ms in production
- Slow initial page loads even with fast servers
- `generateMetadata` contains file reads or API calls
- Performance degradation with many blog posts

**Prevention:**
```typescript
// BAD - Reads file on every request
export async function generateMetadata({ params }) {
  const post = await readMDXFile(params.slug); // Slow file I/O
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

// GOOD - Pre-generate metadata at build time
// Use content-collections or velite to generate JSON index
import { allPosts } from 'content-collections';

export async function generateMetadata({ params }) {
  // Fast object lookup, no file I/O
  const post = allPosts.find(p => p.slug === params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

**Additional mistake:** Using `generateMetadata` for static pages instead of static `metadata` export
```typescript
// BAD - Unnecessary overhead for static pages
export async function generateMetadata() {
  return { title: 'About Us' };
}

// GOOD - Static export
export const metadata = { title: 'About Us' };
```

**Consequences if ignored:**
- Poor Core Web Vitals (especially LCP, TTFB)
- Lower Google search rankings (Core Web Vitals is ranking factor)
- Degraded user experience
- Server costs increase due to slow responses

**Phase to address:** Phase 3 (Data Layer) - Build-time metadata indexing
**Deeper research needed:** NO - Solution is clear, use build-time compilation

### Pitfall 4: Static Export Dynamic Route Generation Failure

**What happens:**
When using `output: 'export'` for static site generation, dynamic routes like `[slug]` fail to build unless `generateStaticParams` explicitly lists all possible values. Missing routes result in 404 errors in production.

**Root cause:**
Static exports cannot use runtime route resolution. All routes must be known at build time. Without `generateStaticParams`, Next.js cannot determine which pages to pre-render.

**Warning signs:**
- Build succeeds but deployed site shows 404 for blog posts
- Works in dev (`next dev`) but fails in production
- Error: "Page /blog/[slug] is missing generateStaticParams"

**Prevention:**
```typescript
// app/blog/[slug]/page.tsx

// REQUIRED for static export
export async function generateStaticParams() {
  // Must return ALL possible slugs at build time
  const posts = await getAllPosts(); // From build-time index
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <article>{/* ... */}</article>;
}
```

**Additional complexity with bilingual routes:**
```typescript
// app/[locale]/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const locales = ['en', 'he'];

  // Must generate all locale + slug combinations
  return locales.flatMap(locale =>
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}
```

**Consequences if ignored:**
- 404 errors for all blog posts in production
- Complete deployment failure
- Must rebuild and redeploy to add new posts

**Phase to address:** Phase 4 (Routing) - Configure static generation correctly
**Deeper research needed:** NO - Well-documented pattern

---

## Migration-Specific Pitfalls

### Pitfall 5: Contentlayer2 Abandonment Trap

**What happens:**
Continuing to use contentlayer2 creates technical debt. The library is effectively abandoned (maintainer allocates "one day a month"), lacks Next.js 16 support, has unresolved issues with App Router, and will eventually break with future Next.js updates.

**Root cause:**
Stackbit (primary sponsor) was acquired by Netlify, drastically reducing funding. Active development has stopped, and compatibility with modern Next.js features is not being maintained.

**Warning signs:**
- GitHub issues remain open for months
- Last npm publish > 6 months ago
- Compatibility issues with new Next.js versions
- Community discussing migration strategies

**Prevention:**
Migrate immediately. Do not invest time fixing contentlayer2 issues.

**Recommended alternatives:**
1. **content-collections** - Drop-in contentlayer replacement, Next.js App Router native
2. **Velite** - Type-safe, Zod-based, framework-agnostic
3. **@next/mdx** - Built-in Next.js solution (simple use cases)

**Migration complexity:**
- content-collections: LOW (API is nearly identical)
- Velite: MEDIUM (different API, more flexibility)
- @next/mdx: HIGH (completely different approach)

**Phase to address:** Phase 1 (Setup) - Choose replacement immediately
**Deeper research needed:** NO - Alternatives are well-documented

### Pitfall 6: Computed Fields Migration Complexity

**What happens:**
Contentlayer's `computedFields` feature (like slug generation from filename) must be manually reimplemented when migrating. The migration isn't always 1:1, and subtle differences in computed values can break existing URLs.

**Current implementation:**
```typescript
// contentlayer.config.ts
computedFields: {
  slug: {
    type: 'string',
    resolve: (post) => post._raw.flattenedPath.split('/').pop() || '',
  },
  url: {
    type: 'string',
    resolve: (post) => {
      const slug = post._raw.flattenedPath.split('/').pop() || '';
      return `/blog/${slug}`;
    },
  },
}
```

**Migration challenge:**
Different systems have different file path APIs. Ensure slug generation produces IDENTICAL results to preserve SEO and bookmarks.

**Prevention:**
```typescript
// Test slug generation before migration
const oldSlugs = allPosts.map(p => p.slug).sort();
// After migration
const newSlugs = allNewPosts.map(p => p.slug).sort();
// Compare - must match exactly
assert.deepEqual(oldSlugs, newSlugs);
```

**Phase to address:** Phase 2 (MDX Processing) - Implement and verify computed fields
**Deeper research needed:** NO - Testing approach is straightforward

### Pitfall 7: Plugin Configuration Breaking Changes

**What happens:**
Contentlayer accepts remark/rehype plugins as imported functions. content-collections requires plugins in `transform` function. Velite uses different plugin syntax. Direct migration breaks build.

**Current configuration:**
```typescript
// contentlayer.config.ts
mdx: {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeHighlight,
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
  ],
}
```

**content-collections equivalent:**
```typescript
// content-collections.ts
import { compileMDX } from '@content-collections/mdx';

export default defineCollection({
  // ...
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    });
    return { ...document, body: mdx };
  },
});
```

**Warning signs:**
- Build errors about plugin configuration
- Plugins not executing (code blocks not highlighted)
- Type errors on plugin imports

**Phase to address:** Phase 2 (MDX Processing) - Migrate plugin configuration
**Deeper research needed:** NO - Migration guides exist

### Pitfall 8: Bilingual Field Migration Data Loss

**What happens:**
When migrating from contentlayer2's bilingual field structure (`title` + `title_he`, `excerpt` + `excerpt_he`), there's risk of losing Hebrew content if the new system uses different field naming conventions or structures data differently.

**Current schema:**
```typescript
fields: {
  title: { type: 'string', required: true },
  title_he: { type: 'string', required: false },
  excerpt: { type: 'string', required: true },
  excerpt_he: { type: 'string', required: false },
  category: { type: 'string', required: true },
  category_he: { type: 'string', required: false },
}
```

**Migration considerations:**
Different systems may prefer:
- Separate files per locale (`post.en.mdx`, `post.he.mdx`)
- Nested structure (`title.en`, `title.he`)
- Single content field with locale parameter

**Prevention:**
1. **Preserve existing structure** if possible (least migration work)
2. **Write migration script** with data validation
3. **Compare before/after** field counts, ensure no data loss

```typescript
// Migration validation
function validateMigration(oldPosts, newPosts) {
  oldPosts.forEach(oldPost => {
    const newPost = newPosts.find(p => p.slug === oldPost.slug);

    // Ensure all bilingual fields preserved
    assert.equal(oldPost.title_he, newPost.title_he, `Hebrew title missing for ${oldPost.slug}`);
    assert.equal(oldPost.excerpt_he, newPost.excerpt_he, `Hebrew excerpt missing for ${oldPost.slug}`);
    assert.equal(oldPost.category_he, newPost.category_he, `Hebrew category missing for ${oldPost.slug}`);
  });
}
```

**Phase to address:** Phase 1 (Setup) - Design schema with bilingual fields
**Deeper research needed:** NO - Validation approach is straightforward

### Pitfall 9: Build Script Integration Breakage

**What happens:**
contentlayer2 uses a separate build command (`contentlayer2 build`) that must run before Next.js build. When migrating to content-collections or velite, build integration works differently, and CI/CD pipelines can break.

**Current setup:**
```json
// package.json
"scripts": {
  "contentlayer": "contentlayer2 build",
  "dev": "next dev --turbopack",
  "build": "next build --turbopack"
}
```

**Problem:** Developers must remember to run `npm run contentlayer` manually before build.

**content-collections approach:**
Integrates with Next.js build automatically via `withContentCollections` wrapper:

```javascript
// next.config.js
import { withContentCollections } from '@content-collections/next';

export default withContentCollections({
  // Next.js config
});
```

**Velite approach:**
Separate build step like contentlayer:

```json
"scripts": {
  "build": "velite && next build"
}
```

**Prevention:**
- Update CI/CD pipeline scripts
- Document build process clearly
- Test full build from clean state

**Phase to address:** Phase 1 (Setup) - Configure build integration
**Deeper research needed:** NO - Each library documents build integration

---

## Bilingual/RTL Pitfalls

### Pitfall 10: Global RTL Setting Breaking LTR Content

**What happens:**
Setting `dir="rtl"` at document level (`<html>` or `<body>`) flips the entire page direction, breaking English content. Navigation menus appear on wrong side, icons flip incorrectly, layout becomes unusable for LTR content.

**Root cause:**
CSS logical properties (`margin-inline-start`, `padding-inline-end`) and flexbox direction (`flex-row`) reverse when parent has `dir="rtl"`.

**Prevention:**
```typescript
// BAD - Global RTL breaks everything
<html dir="rtl">

// GOOD - Locale-aware direction
<html dir={locale === 'he' ? 'rtl' : 'ltr'}>

// GOOD - Content-specific direction
<article dir={post.locale === 'he' ? 'rtl' : 'ltr'}>
  {post.content}
</article>
```

**CSS considerations:**
```css
/* BAD - Assumes LTR */
.nav {
  margin-left: 2rem;
}

/* GOOD - Direction-aware */
.nav {
  margin-inline-start: 2rem;
}
```

**Phase to address:** Phase 5 (i18n Integration) - Implement locale-aware direction
**Deeper research needed:** NO - Standard practice

### Pitfall 11: Font Rendering Issues with Hebrew

**What happens:**
English-optimized fonts render Hebrew characters poorly (bad kerning, wrong weights, missing glyphs). Hebrew text appears broken or unprofessional.

**Prevention:**
```css
/* Separate font stacks per locale */
:root {
  --font-en: 'Inter', system-ui, sans-serif;
  --font-he: 'Assistant', 'Rubik', 'Heebo', system-ui, sans-serif;
}

html[dir='ltr'] {
  font-family: var(--font-en);
}

html[dir='rtl'] {
  font-family: var(--font-he);
}
```

**Popular Hebrew fonts:**
- Rubik (geometric, modern)
- Heebo (clean, readable)
- Assistant (friendly, approachable)
- Alef (classic, professional)

**Warning:** Google Fonts loads additional fonts = performance impact. Consider:
- Subset fonts (Hebrew + Latin only)
- Use system fonts for Hebrew when acceptable
- Preload critical font files

**Phase to address:** Phase 5 (i18n Integration) - Configure fonts
**Deeper research needed:** NO - Well-established best practice

### Pitfall 12: next-intl Locale Cookie Caching Issue

**What happens:**
When user switches language, Next.js serves cached page without routing through middleware. Locale cookie doesn't get set, causing language preference loss on refresh.

**Root cause:**
Next.js client-side cache bypasses middleware for performance. After language switch, must force middleware execution.

**Prevention:**
```typescript
// In language switcher component
'use client';

import { useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
    router.refresh(); // Forces middleware to run, sets cookie
  };

  return (
    <button onClick={() => switchLanguage('he')}>
      עברית
    </button>
  );
}
```

**Phase to address:** Phase 5 (i18n Integration) - Implement language switcher
**Deeper research needed:** NO - Documented next-intl behavior

### Pitfall 13: Not-Found Page in [locale] Dynamic Segment

**What happens:**
When using `[locale]` dynamic route segment with bilingual setup, not-found pages may not display correctly or show in wrong language. This is Next.js design behavior with dynamic segments, not a bug.

**Root cause:**
Next.js handles not-found pages differently in dynamic segments. The not-found page must be placed at the correct level and handle locale context.

**Prevention:**
```
app/
  [locale]/
    not-found.tsx       <-- Locale-aware not-found
    layout.tsx
    blog/
      [slug]/
        page.tsx
```

```typescript
// app/[locale]/not-found.tsx
import { useParams } from 'next/navigation';

export default function NotFound() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div dir={locale === 'he' ? 'rtl' : 'ltr'}>
      {locale === 'he' ? (
        <h1>הדף לא נמצא</h1>
      ) : (
        <h1>Page Not Found</h1>
      )}
    </div>
  );
}
```

**Phase to address:** Phase 5 (i18n Integration) - Configure not-found pages
**Deeper research needed:** NO - Expected Next.js behavior

### Pitfall 14: SEO Metadata Language Mismatch

**What happens:**
Search engines index Hebrew pages with English metadata or vice versa. Google shows wrong language snippets in search results, damaging click-through rates.

**Root cause:**
`generateMetadata` not locale-aware, always returns English metadata regardless of page locale.

**Prevention:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const post = await getPost(slug);

  return {
    title: locale === 'he' ? post.title_he : post.title,
    description: locale === 'he' ? post.excerpt_he : post.excerpt,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        'en': `/en/blog/${slug}`,
        'he': `/he/blog/${slug}`,
      },
    },
    openGraph: {
      title: locale === 'he' ? post.title_he : post.title,
      description: locale === 'he' ? post.excerpt_he : post.excerpt,
      locale: locale === 'he' ? 'he_IL' : 'en_US',
    },
  };
}
```

**Additional: HTML lang attribute**
```typescript
// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
```

**Phase to address:** Phase 6 (SEO Integration) - Implement locale-aware metadata
**Deeper research needed:** NO - Standard SEO practice

---

## Turbopack Pitfalls

### Pitfall 15: Plugin Options Not Serializable

**What happens:**
Complex rehype/remark plugins with function callbacks or non-plain objects fail with Turbopack's serialization requirements. Even when using string plugin names, options object must be JSON-serializable.

**Example failure:**
```typescript
// This WILL FAIL with Turbopack
rehypePlugins: [
  ['rehype-autolink-headings', {
    behavior: 'wrap',
    properties: {
      className: ['anchor'],
    },
    // This callback function cannot be serialized
    content: (node) => ({
      type: 'element',
      tagName: 'span',
      properties: { className: ['icon'] },
    }),
  }],
]
```

**Root cause:**
Turbopack requires all loader options to be JSON-serializable for parallel processing. Functions, class instances, and complex objects cannot be serialized.

**Prevention:**
```typescript
// Use only serializable options
rehypePlugins: [
  ['rehype-autolink-headings', {
    behavior: 'wrap',  // String ✓
    properties: {      // Plain object ✓
      className: ['anchor'], // Array of strings ✓
    },
    // Omit callback functions
  }],
]
```

**If complex plugins required:**
May need to fall back to webpack for build or find alternative plugins.

**Phase to address:** Phase 1 (Setup) - Audit all plugins for Turbopack compatibility
**Deeper research needed:** YES - Need to verify each current plugin (rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings) works with Turbopack string references

### Pitfall 16: MDX Multibyte Character Build Panic

**What happens:**
MDX files containing Japanese, Hebrew, or other multibyte Unicode characters trigger SWC panic during build, causing complete build failure with cryptic error messages.

**Documented in:** Next.js issue #87713 - "SWC panic with MDX files containing multibyte characters in 16.1.0+"

**Warning signs:**
- Build works in Next.js 15, fails in Next.js 16
- Error mentions "SWC" or "panic"
- MDX files with Hebrew content (עברית) trigger error
- Error only occurs with certain characters

**Current status:**
This is a known regression in Next.js 16.1.0+. Check if issue has been resolved before upgrading to Next.js 16.1+.

**Workarounds:**
1. Pin Next.js to 16.0.x until fixed
2. Monitor GitHub issue for resolution
3. Test builds with Hebrew content before deploying

**Prevention:**
```bash
# Test build with all Hebrew MDX files
npm run build

# If fails, check Next.js version
npm list next

# Pin to working version
npm install next@16.0.8 --save-exact
```

**Phase to address:** Phase 1 (Setup) - Version pinning and testing
**Deeper research needed:** YES - Monitor Next.js 16.1+ releases, test Hebrew MDX files with newer versions

### Pitfall 17: Turbopack Dev vs Build Inconsistencies

**What happens:**
MDX renders correctly in `next dev --turbo` but fails in `next build --turbo`, or vice versa. Turbopack is still marked as "beta" and has different behavior between dev and build modes.

**Root cause:**
Turbopack has separate code paths for dev (faster, less optimized) and build (production-optimized). Plugin handling, module resolution, and MDX compilation may differ.

**Warning signs:**
- "Works on my machine" (dev mode)
- Build fails in CI/CD
- Visual differences between dev and production
- Missing syntax highlighting in production build

**Prevention:**
```bash
# Test production build locally BEFORE deploying
npm run build
npm run start

# Compare to dev mode
npm run dev
```

**If inconsistencies found:**
1. Report to Next.js GitHub (Turbopack is beta)
2. Consider removing `--turbo` flag temporarily
3. Simplify MDX plugin configuration

**Current recommendation:**
Turbopack for Next.js 16 is still beta. For production blogs, consider:
- Remove `--turbo` flag for builds: `"build": "next build"` (use webpack)
- Keep `--turbo` for dev: `"dev": "next dev --turbo"` (faster DX)

**Phase to address:** Phase 1 (Setup) - Build configuration strategy
**Deeper research needed:** MAYBE - Monitor Turbopack stability in Next.js 16.x releases

---

## SEO and Metadata Pitfalls

### Pitfall 18: Missing generateStaticParams Hurts SEO

**What happens:**
Dynamic blog routes without `generateStaticParams` force on-demand rendering, losing pre-rendering SEO benefits. Google crawls empty loading states, pages don't appear in search results.

**Root cause:**
Without static generation, pages render on first request. Bots may see loading spinners or SSR delays, missing actual content.

**Prevention:**
Always implement `generateStaticParams` for content pages:

```typescript
// Required for SEO
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Also enable static rendering
export const dynamic = 'force-static';
```

**Phase to address:** Phase 4 (Routing) - Static generation configuration
**Deeper research needed:** NO - Standard Next.js SEO practice

### Pitfall 19: Duplicate Metadata Exports

**What happens:**
Accidentally exporting both `metadata` object AND `generateMetadata` function from same route causes build error: "Cannot export both metadata and generateMetadata."

**Prevention:**
Choose one approach per route:

```typescript
// Static pages - use metadata object
export const metadata = {
  title: 'About Us',
  description: 'Learn about our company',
};

// Dynamic pages - use generateMetadata function
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// NEVER export both in same file
```

**Phase to address:** Phase 6 (SEO Integration) - Metadata implementation
**Deeper research needed:** NO - Clear Next.js rule

### Pitfall 20: Frontmatter Not Supported by @next/mdx

**What happens:**
When using `@next/mdx`, YAML frontmatter in MDX files is ignored. Metadata like title, date, author must be handled separately.

**Root cause:**
`@next/mdx` focuses on component rendering, not content management. Frontmatter is a content management feature.

**Prevention:**

**Option 1:** Use content-collections or velite (handles frontmatter)

**Option 2:** Manual frontmatter parsing
```typescript
import fs from 'fs';
import matter from 'gray-matter';

export async function getPost(slug: string) {
  const fileContent = fs.readFileSync(`content/blog/${slug}.mdx`, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data,
    content,
  };
}
```

**Option 3:** Use remark-mdx-frontmatter plugin
```bash
npm install remark-mdx-frontmatter
```

**Phase to address:** Phase 2 (MDX Processing) - Frontmatter handling strategy
**Deeper research needed:** NO - Multiple established solutions

### Pitfall 21: Missing Structured Data for Blog Posts

**What happens:**
Blog posts lack JSON-LD structured data (BlogPosting schema), reducing rich snippet visibility in Google search results. Missing featured snippets, author info, publication dates in search.

**Root cause:**
Structured data not automatically generated from MDX frontmatter.

**Prevention:**
```typescript
// app/[locale]/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    image: post.thumbnail,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article>{/* ... */}</article>
    </>
  );
}
```

**Phase to address:** Phase 6 (SEO Integration) - Structured data generation
**Deeper research needed:** NO - Standard schema.org implementation

### Pitfall 22: Canonical URL Misconfiguration

**What happens:**
Missing or incorrect canonical URLs cause duplicate content penalties. Especially critical with bilingual content (same post in multiple languages).

**Prevention:**
```typescript
export async function generateMetadata({ params }) {
  const { locale, slug } = params;

  return {
    alternates: {
      canonical: `https://kohelet.digital/${locale}/blog/${slug}`,
      languages: {
        'en': `https://kohelet.digital/en/blog/${slug}`,
        'he': `https://kohelet.digital/he/blog/${slug}`,
      },
    },
  };
}
```

**Critical rules:**
1. Always use absolute URLs (https://...)
2. Include locale in canonical URL
3. Use hreflang alternates for bilingual content
4. Ensure trailing slash consistency

**Phase to address:** Phase 6 (SEO Integration) - Canonical URL configuration
**Deeper research needed:** NO - Standard SEO practice

### Pitfall 23: OG Images Not Generated Per Post

**What happens:**
All blog posts share same OpenGraph image in social shares, reducing click-through rates and social engagement. Posts look generic when shared on Twitter/LinkedIn/Facebook.

**Prevention:**

**Option 1:** Static images per post
```typescript
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return {
    openGraph: {
      images: [post.thumbnail || '/default-og.jpg'],
    },
  };
}
```

**Option 2:** Dynamic OG image generation (advanced)
```typescript
// app/[locale]/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function OGImage({ params }) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div style={{ /* ... */ }}>
        <h1>{post.title}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**Phase to address:** Phase 6 (SEO Integration) - OG image strategy
**Deeper research needed:** NO - Next.js OG image generation is documented

---

## Phase-Specific Warnings

| Phase | Pitfall Risk | Mitigation Strategy |
|-------|-------------|---------------------|
| **Phase 1: Setup** | Turbopack plugin serialization (#1), Build integration (#9) | Test with `--turbo` flag immediately, configure string-based plugins |
| **Phase 2: MDX Processing** | Plugin configuration breaking changes (#7), Frontmatter handling (#20) | Choose library with frontmatter support, verify plugin migration |
| **Phase 3: Data Layer** | generateMetadata performance (#3), Field migration data loss (#8) | Build-time indexing, validate all bilingual fields preserved |
| **Phase 4: Routing** | Static export route generation (#4), generateStaticParams missing (#18) | Implement comprehensive static params, test build output |
| **Phase 5: i18n Integration** | RTL/LTR conflicts (#2, #10), Locale cookie caching (#12), Not-found pages (#13) | Direction-aware components, router.refresh on language switch |
| **Phase 6: SEO Integration** | Metadata language mismatch (#14), Missing structured data (#21), Canonical URLs (#22) | Locale-aware metadata, JSON-LD schema, hreflang alternates |

---

## Testing Checklist

Before considering migration complete, verify:

**Turbopack Compatibility:**
- [ ] `next dev --turbo` runs without errors
- [ ] `next build --turbo` completes successfully
- [ ] All remark/rehype plugins execute correctly
- [ ] Hebrew MDX files build without SWC panic

**Bilingual Functionality:**
- [ ] Hebrew text displays with correct RTL direction
- [ ] Mixed RTL/LTR content renders properly (URLs, code, English phrases)
- [ ] Language switcher updates locale cookie
- [ ] Hebrew font renders clearly and professionally
- [ ] Not-found pages display in correct language

**Migration Integrity:**
- [ ] All 5 existing blog posts migrated successfully
- [ ] Slug generation matches contentlayer2 exactly
- [ ] All bilingual fields preserved (title_he, excerpt_he, category_he)
- [ ] URLs remain identical (no broken links)

**SEO Configuration:**
- [ ] generateStaticParams implemented for all dynamic routes
- [ ] Locale-aware metadata for Hebrew and English pages
- [ ] Canonical URLs configured with hreflang alternates
- [ ] JSON-LD structured data present on blog posts
- [ ] OpenGraph images configured per post

**Performance:**
- [ ] TTFB < 600ms for blog post pages
- [ ] generateMetadata uses build-time data (no file I/O)
- [ ] Static generation produces HTML for all posts
- [ ] Core Web Vitals within acceptable ranges

---

## Sources

**Migration and Alternatives:**
- [Migrating from Contentlayer to Content Collections | Dub](https://dub.co/blog/content-collections)
- [ContentLayer has been Abandoned - What are the Alternatives? | Wisp CMS](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [Migrate from Contentlayer | Content Collections](https://www.content-collections.dev/docs/migration/contentlayer)
- [Replacing Contentlayer with Markdownlayer | Maxwell Weru](https://www.maxwellweru.com/blog/2024/03/replacing-contentlayer-with-markdownlayer)

**Next.js MDX Implementation:**
- [Building a Modern Blog with MDX and Next.js 16 | MDXBlog.io](https://www.mdxblog.io/code/building-a-modern-blog-with-mdx-and-nextjs-16)
- [Guides: MDX | Next.js](https://nextjs.org/docs/app/guides/mdx)
- [How I Built my Blog using MDX, Next.js, and React | Josh W. Comeau](https://www.joshwcomeau.com/blog/how-i-built-my-blog/)
- [Building a blog with Next.js App Router and MDX | Alex Chan](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx)

**Turbopack Compatibility:**
- [MDX Loader Issues in Next.js 15.5.x (with Turbopack) - and How to Fix Them | Yimin Yang](https://www.yiminyang.dev/blog/mdx-loader-issues-in-nextjs-155x-with-turbopack-and-how-to-fix-them)
- [Unable to use MDX with turbopack · Issue #74424 | Next.js GitHub](https://github.com/vercel/next.js/issues/74424)
- [@next/mdx not compatible with --turbo · Issue #67453 | Next.js GitHub](https://github.com/vercel/next.js/issues/67453)
- [SWC panic with MDX files containing multibyte characters · Issue #87713 | Next.js GitHub](https://github.com/vercel/next.js/issues/87713)

**Internationalization:**
- [Next.js App Router internationalization (i18n) | next-intl](https://next-intl.dev/docs/getting-started/app-router)
- [Implementing Internationalization (i18n) in Next.js 15 with the App Router | ALI DEV](https://www.ali-dev.com/blog/implementing-internationalization-i18n-in-next-js-15-with-the-app-router)
- [Next.js 15 App Router Internationalization with URL-Based Routing | Thomas Augot](https://medium.com/@thomasaugot/next-js-15-app-router-internationalization-with-url-based-routing-7e49413dc7c1)

**RTL and Bilingual Content:**
- [Development and design of RTL website: peculiarities | Ilya Roytberg](https://medium.com/@ilyaroytberg/development-and-design-of-rtl-website-peculiarities-cd4c027469ff)
- [Right-to-Left (RTL) Localization: What You Need To Know | OneSky Blog](https://www.onesky.ai/blog/rtl-language)
- [Planning for RTL Languages: Layout, Content, and QA | Argos Multilingual](https://www.argosmultilingual.com/blog/planning-for-rtl-languages-how-layout-content-and-qa-fit-together)

**SEO and Metadata:**
- [Functions: generateMetadata | Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Using generateMetadata for SEO in Next.js 13+ | Radical Labs](https://radicallabs.io/blog/using-generatemetadata-for-seo-in-nextjs-13)
- [Next.js SEO: Metadata, Sitemaps & Canonical Tags for App Router | Prateeksha](https://prateeksha.com/blog/nextjs-app-router-seo-metadata-sitemaps-canonicals)
- [Building an SEO-Optimized Blog with Next.js and MDX | DEV Community](https://dev.to/pavel_buyeu/building-an-seo-optimized-blog-with-nextjs-and-mdx-from-routing-to-rendering-2h72)

**Performance Comparisons:**
- [Comparison of MDX integration strategies with Next.js | DEV Community](https://dev.to/tylerlwsmith/quick-comparison-of-mdx-integration-strategies-with-next-js-1kcm)
- [@next/mdx VS. next-mdx-remote | cyishere.dev](https://www.cyishere.dev/blog/next-mdx-or-next-mdx-remote)
- [Limitations of next mdx remote and an Alternative Approach | MDXBlog.io](https://www.mdxblog.io/blog/next-mdx-remote-limitations)

**Static Export:**
- [Guides: Static Exports | Next.js](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js static site with MDX + dynamic routes + metadata | Anders D. Johnson](https://andersdjohnson.com/posts/nextjs-static-mdx-dynamic-routes-metadata)
- [Support dynamic routes in static export mode · Discussion #55393 | Next.js GitHub](https://github.com/vercel/next.js/discussions/55393)

---

## Confidence Assessment

| Category | Confidence | Reasoning |
|----------|-----------|-----------|
| **Turbopack Pitfalls** | HIGH | Multiple authoritative sources, documented GitHub issues, specific code examples |
| **RTL/Bilingual** | MEDIUM | General web development knowledge, not MDX-specific, some sources are generic RTL guides |
| **Migration from Contentlayer** | HIGH | Multiple migration guides, official docs, real migration experiences |
| **SEO/Metadata** | HIGH | Official Next.js documentation, standard schema.org practices, well-established patterns |

**Overall Confidence:** HIGH

Most critical pitfalls (#1-4) are backed by multiple authoritative sources and documented issues. Migration pitfalls are based on official migration guides. SEO recommendations follow standard Next.js and schema.org practices.

Lower confidence area is RTL implementation specifics, as sources are general web development rather than MDX-specific, but principles remain valid.
