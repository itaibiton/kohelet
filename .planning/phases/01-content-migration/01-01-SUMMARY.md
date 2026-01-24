---
phase: 01-content-migration
plan: 01
subsystem: content
tags: [mdx, i18n, next-intl, content-migration, bilingual]

# Dependency graph
requires:
  - phase: none
    provides: initial blog posts existed in single-file format
provides:
  - Folder-based locale-separated blog structure (5 posts)
  - Clean frontmatter without _he suffix fields
  - Complete Hebrew and English content for MVP post
  - needsTranslation flags for 4 posts awaiting translation
affects: [02-velite-implementation, 03-bilingual-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [folder-based-locales, locale-specific-frontmatter]

key-files:
  created:
    - content/blog/ai-powered-development-workflow/en.mdx
    - content/blog/ai-powered-development-workflow/he.mdx
    - content/blog/building-modern-websites-nextjs/en.mdx
    - content/blog/building-modern-websites-nextjs/he.mdx
    - content/blog/design-systems-at-scale/en.mdx
    - content/blog/design-systems-at-scale/he.mdx
    - content/blog/mvp-4-week-sprint-guide/en.mdx
    - content/blog/mvp-4-week-sprint-guide/he.mdx
    - content/blog/scaling-digital-products/en.mdx
    - content/blog/scaling-digital-products/he.mdx
  modified: []

key-decisions:
  - "Use folder-based structure ({slug}/en.mdx, {slug}/he.mdx) over single-file with markers"
  - "Add needsTranslation flag to Hebrew placeholders (4 posts) to track translation status"
  - "Extract complete bilingual content for MVP post from language markers"

patterns-established:
  - "Blog posts live in content/blog/{slug}/ folders"
  - "Each post has en.mdx and he.mdx with locale-specific frontmatter"
  - "No _he suffix in frontmatter - clean separation by file"
  - "needsTranslation: true marks content awaiting translation"

# Metrics
duration: 12min
completed: 2026-01-24
---

# Phase 01 Plan 01: Content Migration Summary

**Migrated 5 blog posts from single-file to folder-based locale structure with clean frontmatter and complete bilingual MVP content**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-24T22:32:31Z
- **Completed:** 2026-01-24T22:44:11Z
- **Tasks:** 3
- **Files modified:** 15 (10 created, 5 deleted)

## Accomplishments
- Migrated 4 English-only posts to folder structure with Hebrew placeholders
- Extracted complete Hebrew and English content for MVP post (no markers)
- Removed all _he suffix fields from frontmatter
- Established folder-based locale pattern for Phase 2 (Velite)

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate 4 English-only posts to folder structure** - `d6b04a4` (feat)
2. **Task 2: Migrate MVP post with bilingual content extraction** - `19fdcdc` (feat)
3. **Task 3: Verify migration and remove original files** - `8381fcc` (chore)

## Files Created/Modified

**Created (10 files):**
- `content/blog/ai-powered-development-workflow/en.mdx` - English AI development post
- `content/blog/ai-powered-development-workflow/he.mdx` - Hebrew placeholder with needsTranslation
- `content/blog/building-modern-websites-nextjs/en.mdx` - English Next.js post
- `content/blog/building-modern-websites-nextjs/he.mdx` - Hebrew placeholder with needsTranslation
- `content/blog/design-systems-at-scale/en.mdx` - English design systems post
- `content/blog/design-systems-at-scale/he.mdx` - Hebrew placeholder with needsTranslation
- `content/blog/mvp-4-week-sprint-guide/en.mdx` - Complete English MVP guide (357 lines)
- `content/blog/mvp-4-week-sprint-guide/he.mdx` - Complete Hebrew MVP guide (357 lines)
- `content/blog/scaling-digital-products/en.mdx` - English scaling post
- `content/blog/scaling-digital-products/he.mdx` - Hebrew placeholder with needsTranslation

**Deleted (5 files):**
- `content/blog/ai-powered-development-workflow.mdx`
- `content/blog/building-modern-websites-nextjs.mdx`
- `content/blog/design-systems-at-scale.mdx`
- `content/blog/mvp-4-week-sprint-guide.mdx`
- `content/blog/scaling-digital-products.mdx`

## Decisions Made

**1. Folder-based locale separation**
- Chose `{slug}/en.mdx` and `{slug}/he.mdx` over single file with markers
- Rationale: Cleaner for Velite processing, aligns with next-intl architecture, easier to maintain

**2. needsTranslation flag strategy**
- Added `needsTranslation: true` to 4 Hebrew placeholder files
- Rationale: Explicit tracking of translation status, enables future automation

**3. Complete content extraction for MVP**
- Extracted both languages from markers into separate files
- Rationale: MVP post has full Hebrew and English, no need for placeholder

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - migration completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 2 (Velite Implementation):**
- All blog posts in folder-based structure
- Clean frontmatter compatible with Velite schema
- Locale-specific files ready for Velite collections

**No blockers identified.**

**Translation work identified:**
- 4 posts marked with needsTranslation flag
- Can be addressed in parallel with Phase 2-5 or deferred to Phase 6

---
*Phase: 01-content-migration*
*Completed: 2026-01-24*
