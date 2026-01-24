# Kohelet Digital — Blog System Refactor

## What This Is

A bilingual (Hebrew/English) blog system for Kohelet Digital's marketing website. Provides SEO-optimized articles with structured data for search engines and AI answer engines. Targets non-technical founders in the Israeli market.

## Core Value

**Content must be easy to author in Markdown and render reliably in both Hebrew (RTL) and English.** If the authoring or rendering breaks, the entire blog is useless.

## Current Milestone: v1.0 Blog Refactor

**Goal:** Replace broken contentlayer2 with a modern, reliable file-based content system

**Target features:**
- Separate files per language (`post.en.mdx` + `post.he.mdx`)
- Full SEO/structured data support (Article, FAQ, Breadcrumb schemas)
- Categories and tags
- Full-text search
- Author profiles
- RTL support for Hebrew

## Requirements

### Validated

(None yet — this is a refactor of existing broken system)

### Active

- [ ] File-based MDX content system (replace contentlayer2)
- [ ] Bilingual support with separate locale files
- [ ] Category/tag taxonomy
- [ ] Full-text blog search
- [ ] Author profiles with avatars and bios
- [ ] SEO structured data (Article, FAQ, Breadcrumb)
- [ ] Sitemap generation including blog posts
- [ ] RTL rendering for Hebrew content

### Out of Scope

- CMS admin UI — content authored in code editor
- Comments system — not needed for marketing blog
- Newsletter integration — handle separately
- Analytics dashboard — use Vercel Analytics

## Context

**Existing state:**
- Next.js 16.1.4 with Turbopack (default bundler)
- Contentlayer2 installed but broken (hangs at 100% CPU, never generates files)
- 5 existing MDX blog posts in `content/blog/`
- Bilingual site using next-intl for i18n
- Existing schema utilities in `lib/schema.ts`

**Known issues:**
- Contentlayer2 incompatible with Turbopack (webpack integration only)
- Contentlayer2 CLI hangs indefinitely on this system
- Node.js v24 may have compatibility issues (tested v20 too, same problem)

## Constraints

- **Tech stack**: Must work with Next.js 16+ and Turbopack
- **Deployment**: Vercel (static generation preferred)
- **Content format**: MDX (existing posts already in MDX)
- **i18n**: Integrate with existing next-intl setup

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Replace contentlayer2 | Broken, incompatible with Turbopack, hangs at 100% CPU | — Pending |
| Separate locale files | Cleaner than markers, easier to maintain | — Pending |
| File-based over CMS | Simpler deployment, git-versioned, fits scale | — Pending |

---
*Last updated: 2026-01-24 after milestone initialization*
