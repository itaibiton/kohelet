# Services heading above content

Issue #13 · implementation `83b9f2e` · PR #14, stacked on PR #12.

The services introduction now uses a single column at every breakpoint: the “What we do” label appears above the headline and description. Removed its former top padding and the tablet two-column override. Mobile keeps its 22px gap; tablet/desktop use 24px. This shared selector occurs only in the services introduction, so English and Hebrew both inherit the change with their existing text direction.

Verification:

- `npm run build`: pass, TypeScript and all 26 routes.
- PostCSS parse of `app/codex-landing/landing.css` and `git diff --check`: pass.
- Independent CSS review: no findings; responsive overrides and RTL remain consistent.
- Eight optimized browser cases: English/Hebrew at CSS widths 320/390/768/1440. Each has one heading column, the label’s bottom above the content’s top, and no horizontal overflow. [Measurements](browser-results.json).
- Browser warning/error log: empty.
- `npm run lint`: existing circular FlatCompat React configuration failure before source inspection (#3/#7); draft status retained.

[English desktop](en-desktop.jpg) · [English mobile](en-mobile.jpg) · [Hebrew desktop](he-desktop.jpg) · [Hebrew mobile](he-mobile.jpg)

Screenshots retain the browser canvas context. No new animation, form submission, merge or production deployment.

Combined local preview: [English](http://127.0.0.1:3013/codex-landing#services) · [Hebrew](http://127.0.0.1:3013/he/codex-landing#services). The English services section is left open for review.

Merge order: #5 → #9 → #12 → #14. Itai merges and deploys.
