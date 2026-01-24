# Phase 1 Research: Content Migration

## Current State Analysis

### Existing Content Files

5 blog posts in `/content/blog/`:

| File | Structure | Has Hebrew Body |
|------|-----------|-----------------|
| ai-powered-development-workflow.mdx | Single file, _he frontmatter | No |
| building-modern-websites-nextjs.mdx | Single file, _he frontmatter | No |
| design-systems-at-scale.mdx | Single file, _he frontmatter | No |
| mvp-4-week-sprint-guide.mdx | Single file, _he frontmatter | Yes (JSX comments) |
| scaling-digital-products.mdx | Single file, _he frontmatter | No |

### Current Frontmatter Pattern

All posts use `_he` suffix pattern:
```yaml
title: "English Title"
title_he: "Hebrew Title"
excerpt: "English excerpt"
excerpt_he: "Hebrew excerpt"
category: "Category"
category_he: "קטגוריה"
```

### Special Case: MVP Post

The `mvp-4-week-sprint-guide.mdx` has bilingual body content using JSX comment markers:
```mdx
{/* HEBREW */}
## Hebrew content...

{/* ENGLISH */}
## English content...
```

This post has ~750 lines with full Hebrew and English versions.

## Target Structure

Per requirements and architecture decisions, target structure is:

```
content/blog/
├── ai-powered-development-workflow/
│   ├── en.mdx
│   └── he.mdx
├── building-modern-websites-nextjs/
│   ├── en.mdx
│   └── he.mdx
├── design-systems-at-scale/
│   ├── en.mdx
│   └── he.mdx
├── mvp-4-week-sprint-guide/
│   ├── en.mdx
│   └── he.mdx
└── scaling-digital-products/
    ├── en.mdx
    └── he.mdx
```

### New Frontmatter Pattern

Each locale file has clean frontmatter (no _he suffix):
```yaml
# en.mdx
---
title: "English Title"
excerpt: "English excerpt"
date: "2026-01-24"
author: "Kohelet Digital"
category: "Category"
published: true
---

# he.mdx
---
title: "Hebrew Title"
excerpt: "Hebrew excerpt"
date: "2026-01-24"
author: "Kohelet Digital"
category: "קטגוריה"
published: true
---
```

## Migration Plan

### Posts Requiring Content Translation

4 posts have English-only body content. For Phase 1 (Content Migration), these will:
1. Create folder structure with en.mdx containing English content
2. Create he.mdx with Hebrew frontmatter but **English body as placeholder**
3. Mark for future translation with frontmatter flag: `needsTranslation: true`

### MVP Post (Special Handling)

`mvp-4-week-sprint-guide.mdx` already has both languages:
1. Extract content before `{/* ENGLISH */}` marker → he.mdx
2. Extract content after `{/* ENGLISH */}` marker → en.mdx
3. Both files are complete, no translation flag needed

## File Operations Summary

| Post | Operations |
|------|------------|
| ai-powered-development-workflow | Create folder, split to en.mdx + he.mdx (placeholder) |
| building-modern-websites-nextjs | Create folder, split to en.mdx + he.mdx (placeholder) |
| design-systems-at-scale | Create folder, split to en.mdx + he.mdx (placeholder) |
| mvp-4-week-sprint-guide | Create folder, extract both langs from markers |
| scaling-digital-products | Create folder, split to en.mdx + he.mdx (placeholder) |

Final: Delete original .mdx files after migration verified.

## Dependencies

- No code changes needed for Phase 1
- Velite configuration (Phase 2) will read from new structure
- Current contentlayer2 will stop working (expected - it's broken anyway)

## Risks

- **Low**: Content loss during migration → Mitigated by git history
- **Low**: Missing files → Verify file counts before/after

## RESEARCH COMPLETE
