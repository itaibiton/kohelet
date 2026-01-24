# Requirements: Blog System Refactor

**Defined:** 2026-01-24
**Core Value:** Content must be easy to author in Markdown and render reliably in both Hebrew and English

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Content System

- [x] **CONT-01**: Blog posts are processed from MDX files using Velite
- [x] **CONT-02**: Each post has separate locale files (en.mdx + he.mdx in same folder)
- [x] **CONT-03**: Frontmatter is validated with TypeScript types (title, excerpt, date, author, category, published)
- [x] **CONT-04**: Content is indexed at build time (not runtime file I/O)
- [x] **CONT-05**: Reading time is computed automatically from content
- [x] **CONT-06**: Slug is derived from folder name

### Bilingual/i18n

- [ ] **I18N-01**: Hebrew content renders with RTL direction
- [ ] **I18N-02**: English content renders with LTR direction
- [ ] **I18N-03**: MDX components (code blocks, blockquotes) are direction-aware
- [ ] **I18N-04**: Mixed direction text (Hebrew with English terms) renders correctly
- [ ] **I18N-05**: Content loads based on current locale from next-intl

### SEO & Metadata

- [ ] **SEO-01**: Article schema markup is generated for each post
- [ ] **SEO-02**: Breadcrumb schema markup is generated for navigation
- [ ] **SEO-03**: FAQ schema markup is generated for posts with FAQ sections
- [ ] **SEO-04**: Hreflang tags link Hebrew and English versions of each post
- [ ] **SEO-05**: Sitemap includes all posts in all locales
- [ ] **SEO-06**: Meta tags (title, description, OG) are locale-aware

### Discovery

- [ ] **DISC-01**: Posts can be assigned to categories
- [ ] **DISC-02**: Category listing pages show posts in that category
- [ ] **DISC-03**: Full-text search finds posts by content
- [ ] **DISC-04**: Search is scoped to current language
- [ ] **DISC-05**: Related posts are suggested based on category/tags

### Author Profiles

- [ ] **AUTH-01**: Posts display author name
- [ ] **AUTH-02**: Posts display author avatar
- [ ] **AUTH-03**: Posts display author bio

## v2 Requirements

Deferred to future milestone.

### Author System
- **AUTH-04**: Dedicated author pages listing all posts by author
- **AUTH-05**: Schema.org Person markup for authors

### Advanced Discovery
- **DISC-06**: Tag taxonomy (separate from categories)
- **DISC-07**: Pagination for large post lists

### Performance
- **PERF-01**: Image optimization for post thumbnails
- **PERF-02**: Lazy loading for below-fold content

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS admin UI | Content authored in code editor, fits workflow |
| Comments system | Not needed for marketing blog |
| Newsletter integration | Handle separately, not blog system concern |
| Auto-translation | Manual translation ensures quality |
| RSS feed | Defer to v2, not critical for launch |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 2 | Complete |
| CONT-06 | Phase 2 | Complete |
| I18N-01 | Phase 3 | Pending |
| I18N-02 | Phase 3 | Pending |
| I18N-03 | Phase 3 | Pending |
| I18N-04 | Phase 3 | Pending |
| I18N-05 | Phase 3 | Pending |
| SEO-01 | Phase 4 | Pending |
| SEO-02 | Phase 4 | Pending |
| SEO-03 | Phase 4 | Pending |
| SEO-04 | Phase 4 | Pending |
| SEO-05 | Phase 4 | Pending |
| SEO-06 | Phase 4 | Pending |
| DISC-01 | Phase 5 | Pending |
| DISC-02 | Phase 5 | Pending |
| DISC-03 | Phase 5 | Pending |
| DISC-04 | Phase 5 | Pending |
| DISC-05 | Phase 5 | Pending |
| AUTH-01 | Phase 3 | Pending |
| AUTH-02 | Phase 3 | Pending |
| AUTH-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-24*
*Last updated: 2026-01-25 after Phase 2 completion*
