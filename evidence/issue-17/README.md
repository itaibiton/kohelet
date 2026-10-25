# Issue #17 — development services

Source commit: `3462090`. Local production build served on port 3017.

- English: http://127.0.0.1:3017/codex-landing
- Hebrew: http://127.0.0.1:3017/he/codex-landing

## Checks

- `npm run build`: pass; TypeScript and all 26 routes.
- Native Next ESLint on the six changed source files: pass.
- `git diff --check`: pass.
- `npm run lint`: existing circular FlatCompat React configuration error, tracked separately in #3/#7. PR stays draft.
- Independent source review: no blocking findings.

Browser QA used the Codex in-app browser against the production build. English and Hebrew were checked at CSS widths 320, 390, 768 and 1440. All eight cases have four service rows and matching icons, three original benefits, the service label above the heading, valid section anchors and no horizontal overflow. Selected work and its navigation link remain hidden. Metadata includes the development offering in both languages.

The development enquiry choice was selected in both languages. Its control remains enabled with name `service` and value `App and website development`. The existing handler reads that value and the API accepts an optional string; no API changes or live form submission were needed. The revised project-scope FAQ opens with Enter and retains keyboard focus in both languages. No browser warnings or errors were captured.

## Screenshots

- `en-desktop.png`, `he-desktop.png`: normal desktop hero, including the new development copy.
- `en-mobile.png`, `he-mobile.png`: 390px mobile hero and branding.
- `en-full-page.png`, `he-full-page.png`: complete page captures.
- `en-development-service.png`, `he-development-service.png`: unaltered crops of the full-page screenshots around the new fourth service.
- `browser-qa.json`: DOM measurements, selected form values, metadata and keyboard results.

The browser uses 80% zoom; screenshots include its canvas margins. Captures were taken from the top after the existing mascot was ready. No animation code changed. The previous animation and reduced-motion review belongs to the parent PRs; this change does not claim new visual approval for that work.

No email-delivery verification, merge or production deployment was performed.
