# Selected work temporarily removed

Issue #15 · implementation `99e9c5b` · draft PR #16, stacked on #14.

A single `showSelectedWork = false` flag in the shared landing component gates both the Selected work section and its header link. The English/Hebrew project copy, markup, styling and assets remain available for the later use-case revision.

The FAQ follows How we work directly. Its normal section spacing is 110px on desktop, 80px on tablet and 65px on mobile. The previous zero top padding now applies only when a work section precedes it, so restoring the section also restores its former spacing.

Verification:

- `npm run build`: pass, TypeScript and all 26 routes.
- Focused installed native Next ESLint on `Landing.tsx`, PostCSS parsing of `landing.css`, and `git diff --check`: pass.
- Independent source/CSS review: no findings.
- Eight optimized browser checks: English/Hebrew at CSS widths 320/390/768/1440. Each has zero work sections, work links and project cards; FAQ immediately follows the approach section with the expected padding; all remaining internal anchors are valid; no horizontal overflow. [Measurements](browser-results.json).
- Browser warnings/errors: none.
- `npm run lint`: existing circular FlatCompat React configuration failure before source inspection (#3/#7); draft status retained.

[English desktop](en-desktop.jpg) · [English mobile](en-mobile.jpg) · [Hebrew desktop](he-desktop.jpg) · [Hebrew mobile](he-mobile.jpg)

[Complete English page](en-page.jpg) · [Complete Hebrew page](he-page.jpg)

Viewport screenshots show the header without a work link; full-page captures show the section order. Screenshots retain browser canvas context. No form data was submitted; no merge or production deployment.

Current preview: [English](http://127.0.0.1:3015/codex-landing) · [Hebrew](http://127.0.0.1:3015/he/codex-landing). English is left open for review.

Merge order: #5 → #9 → #12 → #14 → #16. Itai merges and deploys.
