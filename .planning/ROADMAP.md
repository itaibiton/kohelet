# Roadmap: Blog System Refactor

## Overview

Replace the broken contentlayer2 system with Velite, restructure content to separate files per locale (en.mdx/he.mdx), implement full bilingual support with RTL/LTR handling for Hebrew and English, add comprehensive SEO structured data, and build discovery features. The journey moves from content foundation through technical infrastructure to user-facing features, ensuring reliable authoring and rendering in both languages.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Content Migration** - Restructure existing MDX files to separate locale files
- [ ] **Phase 2: Velite Implementation** - Replace contentlayer2 with Velite build system
- [ ] **Phase 3: Bilingual Integration** - RTL/LTR handling and author profiles
- [ ] **Phase 4: SEO & Metadata** - Structured data, hreflang, and search optimization
- [ ] **Phase 5: Discovery Features** - Search, categories, tags, and related posts

## Phase Details

### Phase 1: Content Migration
**Goal**: Content files are restructured to separate files per locale (en.mdx + he.mdx)
**Depends on**: Nothing (first phase)
**Requirements**: CONT-02
**Success Criteria** (what must be TRUE):
  1. Each blog post exists in a folder with separate en.mdx and he.mdx files
  2. Frontmatter fields are clean (no _he suffix duplication)
  3. All 5 existing posts are migrated without content loss
  4. Content structure aligns with next-intl locale-first philosophy
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Migrate all 5 blog posts to folder-based locale structure

### Phase 2: Velite Implementation
**Goal**: Velite processes MDX files and generates type-safe content at build time
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-03, CONT-04, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. Velite successfully compiles all MDX files at build time
  2. TypeScript types are auto-generated from frontmatter schema
  3. Reading time is computed automatically for each post
  4. Slug is derived from folder name consistently
  5. Build completes without contentlayer2 hanging issues
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Install Velite, create config, integrate with Next.js
- [ ] 02-02-PLAN.md — Update blog pages to use Velite, remove contentlayer2

### Phase 3: Bilingual Integration
**Goal**: Hebrew and English content render correctly with proper text direction and author information
**Depends on**: Phase 2
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. Hebrew posts render with RTL direction, English posts with LTR direction
  2. Mixed direction text (Hebrew with English terms) renders correctly without reversed characters
  3. Code blocks and blockquotes maintain proper direction in RTL context
  4. Posts display author name, avatar, and bio
  5. Content loads correctly based on current locale from next-intl
**Plans**: TBD

Plans:
- TBD

### Phase 4: SEO & Metadata
**Goal**: Search engines can discover and understand content in both languages with proper structured data
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. Each post includes Article schema markup with locale-appropriate metadata
  2. Breadcrumb schema markup provides navigation context
  3. Posts with FAQ sections include FAQ schema markup
  4. Hreflang tags correctly link Hebrew and English versions of each post
  5. XML sitemap includes all posts in both locales
  6. Meta tags (title, description, Open Graph) are locale-aware and unique per post
**Plans**: TBD

Plans:
- TBD

### Phase 5: Discovery Features
**Goal**: Users can find relevant content through search, categories, tags, and recommendations
**Depends on**: Phase 4
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, DISC-05
**Success Criteria** (what must be TRUE):
  1. Users can search blog posts with full-text search scoped to current language
  2. Posts are organized into categories with dedicated listing pages
  3. Search results show only posts in the current language (no mixing Hebrew/English)
  4. Related posts appear at end of each post based on category and tags
  5. Users can navigate category pages to discover topical content
**Plans**: TBD

Plans:
- TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Migration | 1/1 | Complete | 2026-01-25 |
| 2. Velite Implementation | 0/2 | Planned | - |
| 3. Bilingual Integration | 0/TBD | Not started | - |
| 4. SEO & Metadata | 0/TBD | Not started | - |
| 5. Discovery Features | 0/TBD | Not started | - |
