# Research Summary: Blog System Refactor

**Project:** Kohelet Digital Blog System
**Domain:** Bilingual (Hebrew/English) marketing blog for Israeli market
**Researched:** 2026-01-24
**Overall Confidence:** HIGH

## Executive Summary

Contentlayer2 is blocking development with 100% CPU hangs, requiring immediate migration to a modern MDX content layer. After analyzing the 2026 ecosystem, **Velite v0.3.1** emerges as the optimal replacement with explicit Turbopack support, active maintenance (published 3 days ago), and minimal migration effort (3-5 hours).

Beyond the technical migration, research reveals that building a professional bilingual marketing blog requires careful attention to three critical areas: (1) **RTL/LTR text direction handling** for Hebrew content with mixed English elements, (2) **Bilingual SEO with hreflang tags** to avoid duplicate content penalties, and (3) **E-E-A-T compliance** through comprehensive author profiles and structured data. The blog must serve dual audiences - Hebrew-speaking Israeli founders and international English readers - with content that's culturally adapted, not merely translated.

**Critical Finding**: Turbopack's Rust architecture cannot serialize JavaScript functions, breaking many webpack-based content systems. Velite solved this with a specialized Next.js config integration. The current approach (single MDX file with bilingual frontmatter fields) works for 20-50 posts/year scale, but the architecture should migrate to **separate files per locale** (en.mdx / he.mdx) for better content management and true translation independence.

**Time to Complete**: 18-26 hours across 7 phases (2.5-3.5 days total)

## Recommendation

**Migrate to Velite with separate file-per-locale architecture.** This provides:
- Immediate unblocking of development (contentlayer2 replacement)
- Proper separation of Hebrew and English content
- Scalable foundation for 100+ posts
- Better workflow for content creators and translators
- Alignment with next-intl's locale-first philosophy

## Stack Decision

**Primary: Velite v0.3.1**

Velite is the clear winner for this migration:
- **Explicit Turbopack compatibility** with documented Next.js 16 integration patterns
- **Active maintenance** (v0.3.1 published January 21, 2026 vs contentlayer2's stagnation)
- **Low migration effort** (3-5 hours - similar Zod-based API to contentlayer2)
- **Production-ready** with commercial use cases

**Core technologies:**
- **Velite v0.3.1**: Content layer with Zod validation and type generation
- **next-mdx-remote/rsc**: MDX compilation for Velite (or included in Velite)
- **Existing plugins**: remark-gfm, rehype-highlight, rehype-slug, rehype-autolink-headings (all Turbopack-compatible)
- **next-intl**: Already integrated, handles locale routing and translations

**Backup: Native App Router** with next-mdx-remote/rsc if Velite proves problematic - more future-proof but requires manual type generation.

**Avoid:**
- Contentlayer2 (abandoned project, maintenance risk)
- @next/mdx (wrong abstraction for content management)
- Content Collections (stale Next.js adapter, no Turbopack docs)

## Architecture

**Recommended: Separate file-per-locale structure**

```
content/blog/
  building-modern-websites-nextjs/
    en.mdx
    he.mdx
  ai-powered-development/
    en.mdx
    he.mdx
```

**Why this structure:**
- True content independence per locale (body content can be fully different)
- Simpler frontmatter (no `_he` suffix duplication)
- Easier for content creators (clear separation)
- Aligns with next-intl philosophy (locale-first)
- Scalable for translators (edit separate files)

**Key structural decisions:**

1. **Locale-first content loading** - Always pass locale to queries: `getAllPosts(locale)` never fetch all then filter
2. **Consistent slugs across locales** - Same slug for both languages (`/he/blog/mvp-guide` and `/en/blog/mvp-guide`) enables simple locale switching
3. **Static generation with generateStaticParams** - Pre-render all locale + slug combinations at build time
4. **Build-time metadata indexing** - Avoid file I/O in generateMetadata for optimal TTFB

**Integration with existing stack:**
- Works seamlessly with next-intl's `[locale]` routing pattern
- Preserves existing lib/schema.ts utilities (no changes needed)
- Maintains static generation for optimal Core Web Vitals

**Major components:**
1. **Content layer (Velite)** - Processes MDX files, generates TypeScript types, validates frontmatter
2. **Blog data utilities (lib/blog.ts)** - getAllPosts(locale), getPost(slug, locale) with locale-specific queries
3. **Blog routes (app/[locale]/blog/)** - Dynamic routes with generateStaticParams for static generation
4. **MDX components** - Direction-aware wrappers for code, links, embedded content in RTL paragraphs
5. **SEO layer** - Locale-aware generateMetadata, JSON-LD structured data, hreflang tags

## Key Features

### Must Have (Table Stakes - Phase 1-3)

**Phase 1 (Core Publishing):**
- Semantic HTML structure (H1/H2/H3 hierarchy, `<article>`, `<nav>`, `<header>` elements)
- Category taxonomy (3-7 top-level categories, avoid deep hierarchies)
- Bilingual routing with language switcher (preserve locale preference with cookie)
- RTL/LTR CSS handling (direction-aware with logical properties)
- Author profiles with E-E-A-T markup (Schema.org/Person, 50-100 word bio)
- SEO meta tags (title 50-60 chars, description 150-160 chars, unique per page)
- Responsive images (WebP/AVIF, srcset, lazy loading, alt text on all)
- Mobile responsiveness (60%+ traffic, Google mobile-first indexing)
- Core Web Vitals optimization (LCP, INP, CLS in green zone)

**Phase 2 (Discovery & SEO):**
- Search functionality (language-scoped, don't mix Hebrew/English results)
- Hreflang tags (critical for bilingual SEO: `he-IL` and `en-US`)
- XML sitemap with bilingual support (include taxonomy pages)
- Related posts algorithm (same category > shared tags > recent)
- Tag taxonomy (2-4 tags per post, general not specific)
- Reading time estimate (calculate from word count, "5 min read" format)
- Breadcrumbs with Schema.org/BreadcrumbList markup

**Phase 3 (Lead Generation):**
- Newsletter signup (inline mid-post + end-of-post placement)
- Strategic CTAs (one primary CTA per post, context-aware)
- Social sharing buttons (Twitter/X, LinkedIn, Facebook minimum)
- Internal search analytics (track search queries, identify content gaps)

### Should Have (Competitive Advantage - Phase 4)

**Differentiation features (post-launch):**
- Content upgrades (topic-specific PDF guides, templates, checklists - gated with email)
- Table of contents (auto-generated from H2/H3 headings, jump links for long-form)
- Dark mode (respect system preference, toggle option)
- Reading progress indicator (% of article completed, sticky header with progress bar)
- Heatmaps/session recordings (Hotjar or Microsoft Clarity for engagement analysis)

### Defer (v2+ Until Scale Demands)

**Not essential for 20-50 posts/year:**
- Complex multi-author approval workflows (overhead doesn't match scale)
- Advanced commenting with threading/voting (creates moderation burden, most B2B comments are spam)
- Member accounts/paywalls (adds GDPR burden, wrong model for lead-gen blog)
- Guest author program (invitation-only, requires review process)
- AI-powered content recommendations (machine learning overkill for scale)

### Anti-Features (Never Build)

**Deliberately avoid:**
- **Auto-translation of blog posts** - Poor quality, misses cultural nuance, damages credibility
- **Mixed-language posts** - Confusing UX, bad for SEO (hreflang confusion)
- **Daily/multiple posts per week** - Can't maintain quality at scale, dilutes expertise signal
- **Translating every post to both languages** - Unsustainable, some topics more relevant to one market
- **View counters** - Public metrics backfire (low numbers look bad)
- **Share count badges** - Similarly, low share counts = anti-social proof
- **Infinite scroll without pagination** - SEO issues, accessibility problems, user disorientation

## Critical Pitfalls to Avoid

### 1. Turbopack Plugin Serialization Failure (CRITICAL - Phase 1)
**What happens:** Dev server crashes with "loader does not have serializable options" when MDX plugins passed as functions instead of strings. MDX compilation fails, blocking development entirely.

**Prevention:** Use string-based plugin references:
```javascript
// GOOD - String references
remarkPlugins: ['remark-gfm']
rehypePlugins: ['rehype-slug', 'rehype-highlight']
```

**Deeper research needed:** YES - Verify rehypeAutolinkHeadings with behavior callbacks works with Turbopack string references.

### 2. Mixed RTL/LTR Content Direction Conflicts (CRITICAL - Phase 4)
**What happens:** Hebrew paragraphs with English product names, URLs, or code snippets render backwards. Punctuation appears at wrong locations, URLs break mid-word (`moc.elpmaxe//:sptth`), code blocks read right-to-left.

**Prevention:** Wrap LTR content in RTL paragraphs with explicit direction:
```typescript
<p dir="rtl">
  טקסט בעברית עם <span dir="ltr">English phrase</span> המשך בעברית
</p>
```

**Deeper research needed:** YES - Hebrew typography specifics (font sizing, line-height, bold/italic alternatives for readability).

### 3. generateMetadata Performance Bottleneck (CRITICAL - Phase 3)
**What happens:** Reading frontmatter from disk on every metadata generation blocks page rendering, killing TTFB and Core Web Vitals (TTFB > 600ms).

**Prevention:** Use Velite's build-time compilation to generate JSON index, then fast object lookup:
```typescript
// GOOD - Fast object lookup, no file I/O
import { posts } from '.velite'
export async function generateMetadata({ params }) {
  const post = posts.find(p => p.slug === params.slug)
  return { title: post.title, description: post.excerpt }
}
```

**Deeper research needed:** NO - Clear solution with build-time indexing.

### 4. Static Export Dynamic Route Generation Failure (CRITICAL - Phase 4)
**What happens:** Missing `generateStaticParams` causes 404s for all blog posts in production with static exports. Works in dev, fails in production.

**Prevention:** Implement comprehensive generateStaticParams:
```typescript
export async function generateStaticParams() {
  const locales = ['en', 'he']
  return locales.flatMap(locale =>
    posts.map(post => ({ locale, slug: post.slug }))
  )
}
export const dynamicParams = false // Prevent runtime generation
```

**Deeper research needed:** NO - Well-documented Next.js pattern.

### 5. MDX Multibyte Character Build Panic (HIGH - Phase 1)
**What happens:** Hebrew characters trigger SWC panic in Next.js 16.1.0+, causing complete build failure with cryptic error messages.

**Prevention:** Monitor Next.js issue #87713, pin to Next.js 16.0.x if necessary, test Hebrew MDX builds before upgrading.

**Deeper research needed:** YES - Monitor Next.js 16.1+ releases, test Hebrew MDX with newer versions.

### 6. SEO Metadata Language Mismatch (HIGH - Phase 5)
**What happens:** Search engines index Hebrew pages with English metadata or vice versa. Google shows wrong language snippets, damaging click-through rates.

**Prevention:** Locale-aware generateMetadata:
```typescript
export async function generateMetadata({ params }) {
  const { locale, slug } = params
  const post = await getPost(slug, locale)

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
      locale: locale === 'he' ? 'he_IL' : 'en_US',
    },
  }
}
```

**Deeper research needed:** NO - Standard SEO practice.

### 7. Missing Structured Data for Blog Posts (MEDIUM - Phase 5)
**What happens:** Blog posts lack JSON-LD structured data (BlogPosting schema), reducing rich snippet visibility in Google search results.

**Prevention:** Generate structured data from frontmatter using existing lib/schema.ts utilities.

**Deeper research needed:** NO - Standard schema.org implementation.

## Suggested Phase Structure

### Phase 1: Content Migration (2-3 hours)
**Rationale:** Restructure content files before code changes to derisk migration.

**Delivers:**
- New folder structure: `content/blog/[slug]/en.mdx` and `he.mdx`
- 5 existing posts split into separate locale files
- Frontmatter without `_he` suffixes (clean per-locale fields)

**Addresses:** Bilingual content separation (FEATURES.md table stakes)
**Avoids:** Field migration data loss, content body translation limitations
**Research needed:** NO - straightforward file restructure

### Phase 2: Velite Implementation (4-6 hours)
**Rationale:** Replace contentlayer2 with Velite after content structure finalized.

**Delivers:**
- Velite v0.3.1 installed and configured
- velite.config.ts with Zod schema (locale field, validation)
- Turbopack-compatible Next.js integration
- Type generation from content (TypeScript interfaces)

**Uses:** Velite (STACK.md primary recommendation)
**Avoids:** Turbopack serialization issues (Pitfall #1), plugin configuration breaking
**Research needed:** MAYBE - Verify complex plugin options (rehypeAutolinkHeadings callbacks) work with Turbopack

### Phase 3: Content Loading Layer (2-3 hours)
**Rationale:** Update app code to use Velite-generated data instead of contentlayer2.

**Delivers:**
- lib/blog.ts utilities: `getAllPosts(locale)`, `getPost(slug, locale)`
- Updated blog index page (app/[locale]/blog/page.tsx)
- Updated blog post page (app/[locale]/blog/[slug]/page.tsx)
- generateStaticParams with locale loops (all combinations)

**Implements:** Locale-first content loading pattern (ARCHITECTURE.md)
**Avoids:** generateMetadata performance issues (Pitfall #3), missing static params (Pitfall #4)
**Research needed:** NO - standard Velite usage patterns

### Phase 4: RTL/i18n Integration (3-4 hours)
**Rationale:** Proper bidirectional text handling is complex and critical for Hebrew content.

**Delivers:**
- Direction-aware MDX components (wrap LTR content with `dir="ltr"` in RTL paragraphs)
- Language switcher with router.refresh() (sets cookie, prevents caching issues)
- Locale-aware not-found pages (app/[locale]/not-found.tsx)
- Hebrew font configuration (Assistant, Rubik, or Heebo)
- CSS logical properties (margin-inline-start vs margin-left)

**Addresses:** RTL/LTR CSS handling, language switcher (FEATURES.md critical)
**Avoids:** Mixed RTL/LTR conflicts (Pitfall #2), global RTL breaking LTR content (Pitfall #10), font rendering issues
**Research needed:** YES - Hebrew typography specifics (font sizing, line-height, bold/italic alternatives for readability)

### Phase 5: SEO & Metadata (2-3 hours)
**Rationale:** Bilingual SEO is complex and must be correct for discoverability in both markets.

**Delivers:**
- Locale-aware generateMetadata (different title/description per language)
- Hreflang tags (`he-IL` / `en-US` with self-referencing)
- JSON-LD structured data (BlogPosting, Person schemas using existing lib/schema.ts)
- Canonical URLs with language alternates (absolute URLs)
- XML sitemap with both locales

**Addresses:** SEO meta tags, hreflang tags (FEATURES.md critical for bilingual)
**Avoids:** Metadata language mismatch (Pitfall #6), missing structured data (Pitfall #7), canonical URL errors
**Research needed:** NO - well-established patterns with next-intl and Next.js metadata API

### Phase 6: Discovery Features (3-4 hours)
**Rationale:** Search and navigation complete the content discovery experience for professional blog.

**Delivers:**
- Language-scoped search (Hebrew results for Hebrew query, don't mix languages)
- Related posts algorithm (same category > shared tags > recent, 3-4 recommendations)
- Tag taxonomy (2-4 tags per post, general themes)
- Reading time estimate (word count calculation, display in post header)
- Breadcrumbs with Schema.org/BreadcrumbList markup

**Addresses:** Search, tags, related posts (FEATURES.md table stakes for >20 posts)
**Research needed:** MAYBE - Hebrew-language search libraries with better stemming/relevance (Pagefind vs custom)

### Phase 7: Testing & Verification (2-3 hours)
**Rationale:** Comprehensive testing ensures no regressions and proper bilingual functionality.

**Delivers:**
- All routes tested (he/en blog index + all post combinations)
- SEO verification (hreflang tags, schema markup with Google Rich Results Test)
- RTL rendering validation (mixed Hebrew/English content, URLs, code blocks)
- Build from clean state verification (production build test)
- Core Web Vitals measurement (TTFB < 600ms, LCP, INP, CLS in green)

**Avoids:** Static export failures (Pitfall #4), dev vs build inconsistencies (Turbopack beta issues)
**Research needed:** NO - standard QA testing

### Phase Ordering Rationale

**Why this order:**
1. **Content first, code second** - Restructure files before changing code reduces risk and allows rollback
2. **Foundation before features** - Velite + content loading must work before RTL/SEO complexity layered on
3. **Critical path prioritization** - RTL and SEO are blockers for bilingual blog launch, come before nice-to-haves
4. **Incremental validation** - Each phase is deliverable and testable independently
5. **Dependencies respected** - RTL components need content layer, SEO needs both content and RTL

**Total estimated effort:** 18-26 hours (2.5-3.5 days)

### Research Flags

**Needs deeper research during planning:**
- **Phase 2 (Velite Implementation):** Complex rehype plugin options may not serialize for Turbopack - test rehypeAutolinkHeadings with behavior callbacks
- **Phase 4 (RTL/i18n):** Hebrew typography specifics (font recommendations, line-height adjustments, bold/italic alternatives)
- **Phase 6 (Discovery):** Hebrew search libraries for better relevance (Pagefind supports RTL languages, but verify Hebrew stemming quality)

**Standard patterns (skip research-phase):**
- **Phase 1 (Content Migration):** File restructuring is straightforward
- **Phase 3 (Content Loading):** Standard Velite patterns well-documented
- **Phase 5 (SEO):** Well-established next-intl + Next.js metadata patterns
- **Phase 7 (Testing):** Standard QA process

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack (Velite)** | HIGH | Official Turbopack docs, recent release (3 days ago), community migration guides, proven production usage |
| **Features (Table stakes)** | HIGH | Industry standards, multiple authoritative sources (Google SEO docs, HubSpot, Search Engine Journal) |
| **Features (Bilingual)** | MEDIUM | Technical implementation well-documented, less data on specific Hebrew/English blog best practices |
| **Architecture (Velite pattern)** | HIGH | Official docs, similar to contentlayer2 API, existing codebase patterns with next-intl |
| **Architecture (Separate files)** | MEDIUM-HIGH | Better for true translation independence, aligns with next-intl, but adds complexity |
| **Pitfalls (Turbopack)** | HIGH | Multiple GitHub issues (#87713, #74424), documented problems, specific workarounds verified |
| **Pitfalls (RTL/Bilingual)** | MEDIUM | General web development best practices, not MDX-specific, but principles are valid |
| **Pitfalls (Migration)** | HIGH | Official migration guides (Dub, Mike van Peeren), real-world experiences, clear patterns |
| **Pitfalls (SEO)** | HIGH | Google official guidelines, Next.js metadata API documentation, schema.org standards |

**Overall confidence:** HIGH

Strong confidence in Velite recommendation (explicit Turbopack support, active maintenance, low migration effort). Medium confidence in Hebrew-specific optimizations (general RTL principles apply, fewer blog-specific sources). High confidence in critical pitfalls (backed by GitHub issues, official docs, migration experiences).

### Gaps to Address

**Turbopack plugin compatibility:**
- Current plugins (remark-gfm, rehype-highlight, rehype-slug) verified compatible with string references
- Need to verify rehypeAutolinkHeadings behavior options (callbacks) work with Turbopack serialization
- Fallback: Simplify plugin configuration or use webpack for production builds only

**Hebrew typography:**
- Font recommendations exist (Rubik, Heebo, Assistant for Hebrew), but optimal sizing/spacing needs experimentation
- Line-height adjustments, bold/italic alternatives for Hebrew readability require testing with actual content
- Approach: Start with Assistant font (friendly, approachable), iterate based on visual testing

**Search implementation:**
- Multiple approaches viable (Algolia paid/hosted, Pagefind free/static, custom with Flexsearch)
- Hebrew stemming quality varies by library, need to verify Pagefind's RTL language support quality
- Approach: Defer to Phase 6, research when implementing, likely use Pagefind for cost/simplicity

**Content upgrade conversion rates:**
- Lead magnet gating strategy needs A/B testing to optimize
- No data on Israeli market preferences for content upgrades vs newsletter
- Approach: Start simple (email gate only for PDFs), iterate based on conversion analytics

**Hreflang implementation validation:**
- 65% of multilingual sites have hreflang errors according to sources
- Need testing tooling for Hebrew/English specifically (Google Search Console, hreflang validator)
- Approach: Implement per spec, validate with tools in Phase 5

## Sources

### Primary (HIGH confidence)

**Stack Research:**
- [Velite with Next.js Integration Guide](https://velite.js.org/guide/with-nextjs) - Turbopack compatibility documentation
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16) - Turbopack as default bundler
- [Contentlayer Abandonment Discussion](https://github.com/contentlayerdev/contentlayer/issues/429) - Project status confirmation
- Velite NPM (v0.3.1, published January 21, 2026)
- Content Collections NPM (@content-collections/next v0.2.6, last updated September 2025 - stale)

**Architecture Research:**
- [Next.js App Router MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official MDX integration patterns
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Static generation with dynamic routes
- [next-intl Routing Documentation](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing.mdx) - Locale routing patterns
- Existing codebase analysis (app/[locale]/layout.tsx, lib/schema.ts, contentlayer.config.ts)

**Features Research:**
- [Google E-E-A-T Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) - Author profiles requirement
- [Google Multilingual Sites Guide](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) - Hreflang implementation
- [Technical SEO Checklist 2026 - NoGood](https://nogood.io/blog/technical-seo-checklist/) - Core Web Vitals, SEO requirements
- [Author Bio Best Practices - WT Digital](https://wtmarketing.com/blog/author-bio-best-practices/) - E-E-A-T implementation
- [SEO Best Practices for 2026 - Svitla Systems](https://svitla.com/blog/seo-best-practices/)

**Pitfalls Research:**
- [Next.js Issue #87713](https://github.com/vercel/next.js/issues/87713) - SWC panic with multibyte characters (Hebrew)
- [Next.js Issue #74424](https://github.com/vercel/next.js/issues/74424) - MDX with Turbopack serialization issues
- [Migrating from Contentlayer to Content Collections - Dub](https://dub.co/blog/content-collections) - Real migration patterns
- [Turbopack MDX Loader Issues - Yimin Yang](https://www.yiminyang.dev/blog/mdx-loader-issues-in-nextjs-155x-with-turbopack-and-how-to-fix-them) - Serialization solutions
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Performance implications

### Secondary (MEDIUM confidence)

**Stack Research:**
- [Contentlayer Alternatives Analysis - Wisp CMS](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) - Ecosystem survey
- [Refactoring Contentlayer to Velite - Mike van Peeren](https://www.mikevpeeren.nl/blog/refactoring-contentlayer-to-velite) - Migration experience
- [Turbopack 2026 Complete Guide - DEV](https://dev.to/pockit_tools/turbopack-in-2026-the-complete-guide-to-nextjss-rust-powered-bundler-oda) - Ecosystem overview

**Features Research:**
- [Newsletter Trends 2026 - beehiiv](https://www.beehiiv.com/blog/the-state-of-newsletters-2026) - Lead generation data (66-day median time to first dollar)
- [RTL Design Best Practices - Reffine](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices) - RTL/LTR handling
- [RTL Strategy - ConveyThis](https://www.conveythis.com/blog/7-pro-strategies-for-rtl-design) - Bidirectional text patterns
- [Hreflang Implementation Guide 2026 - LinkGraph](https://www.linkgraph.com/blog/hreflang-implementation-guide/) - Common errors (65% of sites)
- [Content Marketing Trends 2026 - WordStream](https://www.wordstream.com/blog/2026-content-marketing-trends)

**Architecture Research:**
- [Building Blog with Next.js and MDX - Alex Chan](https://www.alexchantastic.com/building-a-blog-with-next-and-mdx) - App Router patterns
- [MDX Blog with Next.js 16 - MDXBlog.io](https://www.mdxblog.io/code/building-a-modern-blog-with-mdx-and-nextjs-16) - Recent implementation patterns

**Pitfalls Research:**
- [RTL Website Development - Ilya Roytberg](https://medium.com/@ilyaroytberg/development-and-design-of-rtl-website-peculiarities-cd4c027469ff) - Bidirectional algorithm behavior
- [Planning for RTL Languages - Argos Multilingual](https://www.argosmultilingual.com/blog/planning-for-rtl-languages-how-layout-content-and-qa-fit-together) - Layout considerations
- [Multilingual SEO Localisation 2026 - Optimational](https://optimational.com/blog/complete-guide-multilingual-seo/) - hreflang best practices

---

**Research completed:** 2026-01-24
**Ready for roadmap:** Yes
**Next step:** Roadmap creation using this summary as foundation for phase planning
