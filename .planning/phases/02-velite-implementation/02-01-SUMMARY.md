---
phase: 02-velite-implementation
plan: 01
title: "Velite Configuration and Integration"
subsystem: content-processing
status: complete
completed: 2026-01-24
duration: 3min

requires:
  - 01-01-content-migration

provides:
  - velite-build-infrastructure
  - type-safe-mdx-processing
  - automatic-reading-time
  - bilingual-content-schema

affects:
  - 02-02-data-layer
  - 02-03-component-migration

tech-stack:
  added:
    - velite@0.3.1
    - zod@4.3.6
  removed: []
  patterns:
    - "Velite schema with transform for slug/locale extraction"
    - "Build script integration (velite && next build)"
    - "Turbopack-compatible approach (no webpack plugin)"

key-files:
  created:
    - velite.config.ts
    - .velite/index.d.ts
    - .velite/index.js
    - .velite/posts.json
  modified:
    - package.json
    - next.config.ts
    - tsconfig.json
    - .gitignore

decisions:
  - id: velite-script-approach
    what: Use npm script sequencing instead of programmatic API
    why: Next.js config doesn't support top-level await in current version
    impact: Build runs `velite && next build`, dev runs `velite --watch & next dev`
    alternatives:
      - Programmatic API with top-level await (blocked by Next.js)
      - Webpack plugin (incompatible with Turbopack)

tags: [velite, mdx, content-processing, build-tools, typescript]
---

# Phase 2 Plan 1: Velite Configuration and Integration Summary

**One-liner:** Replaced contentlayer2 with Velite for MDX processing, using build script integration for Turbopack compatibility

## What Was Done

### Task 1: Install Velite and Create Configuration ✅
**Commit:** `c997f08`

- Installed velite@0.3.1 and zod@4.3.6
- Created velite.config.ts with bilingual schema:
  - Pattern: `blog/**/*.mdx` (matches all MDX files in content/blog)
  - Schema fields: title, excerpt, date, author, category, published, needsTranslation, metadata, content
  - Transform function extracts:
    - `slug` from folder name (e.g., "mvp-4-week-sprint-guide")
    - `locale` from filename (e.g., "en.mdx" → "en", "he.mdx" → "he")
    - `url` constructed as `/{locale}/blog/{slug}`
  - Automatic metadata: readingTime and wordCount via `s.metadata()`
- Configured MDX plugins:
  - Remark: remark-gfm (GitHub Flavored Markdown)
  - Rehype: rehype-slug, rehype-autolink-headings, rehype-highlight
- Added `.velite` to .gitignore

**Files modified:** package.json, package-lock.json, velite.config.ts, .gitignore

### Task 2: Integrate Velite with Next.js and TypeScript ✅
**Commit:** `66eb2af`

- Updated next.config.ts:
  - Removed `withContentlayer` wrapper (contentlayer no longer needed)
  - Removed contentlayer import
  - Note: Did NOT use programmatic API with top-level await (Next.js config doesn't support it)
- Updated package.json scripts:
  - `dev`: `velite --watch & next dev --turbopack` (parallel watch + dev server)
  - `build`: `velite && next build --turbopack` (sequential: Velite first, then Next.js)
  - `analyze`: `velite && ANALYZE=true next build --turbopack`
- Updated tsconfig.json:
  - Replaced `"contentlayer/generated": ["./.contentlayer/generated"]` with `".velite": ["./.velite"]`
  - Replaced `.contentlayer/generated` in include array with `.velite`
- Verified build:
  - Velite completed in 667ms
  - Generated 10 posts (5 posts × 2 locales)
  - Created .velite/index.d.ts with Post type
  - Created .velite/posts.json with compiled MDX

**Files modified:** next.config.ts, package.json, tsconfig.json

## Verification Results

### ✅ All Success Criteria Met

1. **Velite builds successfully:**
   - Build output: `[VELITE] build finished in 667.49ms`
   - .velite directory created with index.js, index.d.ts, posts.json

2. **TypeScript types generated:**
   - `.velite/index.d.ts` exports `Post` type and `posts` array
   - Type inferred from velite.config.ts schema

3. **Reading time computed:**
   - Each post has `metadata.readingTime` field
   - Examples: 3min, 2min, 4min, 6min, 1min

4. **Slug extraction working:**
   - "ai-powered-development-workflow"
   - "building-modern-websites-nextjs"
   - "design-systems-at-scale"
   - "mvp-4-week-sprint-guide"
   - "scaling-digital-products"

5. **Locale extraction working:**
   - Each post has locale "en" or "he" based on filename
   - URLs constructed correctly: `/en/blog/{slug}` and `/he/blog/{slug}`

6. **Turbopack compatible:**
   - No webpack plugin errors
   - Build script approach works with Turbopack

### Post Count Verification
- Total posts: 10 (verified via `grep -c '"slug"' .velite/posts.json`)
- 5 unique slugs × 2 locales = 10 posts ✅

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Next.js config doesn't support top-level await**
- **Found during:** Task 2
- **Issue:** Plan specified using programmatic API with `await import('velite')` and `await build()` at top level of next.config.ts. Next.js 16 config doesn't support top-level await (throws `ERR_REQUIRE_ASYNC_MODULE`).
- **Fix:** Changed approach to npm script sequencing:
  - Build: `velite && next build` (runs Velite first, waits for completion, then runs Next.js)
  - Dev: `velite --watch & next dev` (runs Velite watch in background, starts Next.js dev server)
- **Files modified:** package.json (scripts), next.config.ts (removed top-level await code)
- **Commit:** Included in 66eb2af

This is a cleaner solution anyway - separates concerns and works reliably with Turbopack.

## Next Phase Readiness

**Ready for 02-02 (Data Layer Migration):**
- ✅ Velite generating type-safe Post data
- ✅ Reading time available via metadata.readingTime
- ✅ Slug and locale extraction working
- ✅ URL construction matches expected pattern

**Known Limitation:**
- App code still imports from `contentlayer/generated` (causes build errors)
- This is expected - Phase 2 Plan 2 will migrate data layer imports

**No blockers for next plan.**

## Key Learnings

1. **Velite's transform function is powerful:**
   - Can extract slug from folder structure (`meta.path.split('/')`)
   - Can derive locale from filename pattern
   - Can construct URLs based on content location

2. **Build script approach is reliable:**
   - Avoids webpack/Turbopack plugin complexity
   - Works with any Next.js bundler
   - Clear separation of concerns (content processing → app build)

3. **Velite's metadata helper:**
   - `s.metadata()` auto-generates readingTime and wordCount
   - No need for custom reading-time calculation
   - Uses standard 200 words/minute reading speed

## Performance Notes

- **Velite build time:** 667ms for 10 MDX files
- **Total execution time:** 3 minutes
- **Generated output:** 240KB posts.json

Fast enough for development workflow, scales well for production.
