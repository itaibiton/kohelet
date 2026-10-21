# Kohelet landing verification

Current hero (2026-10-21): the approved Robot King illustration replaces the retired interactive blue map. The latest screenshots are `robot-king-*`; older map interaction checks and screenshots below are historical. [Asset and generation prompt](robot-king-asset.md).

Issue #2 · branch `agent/codex/2-codex-landing` · 2026-10-20

Local production-build preview: http://127.0.0.1:3103/codex-landing

## Implemented

English page at `/codex-landing` and complete Hebrew counterpart at `/he/codex-landing`, with the Robot King hero illustration, three service narratives, process, two existing portfolio examples, native FAQ, and accessible contact form. Kohelet assets are reused. Scoped CSS preserves the other root layouts. The existing email endpoint now validates input and checks provider acceptance rather than reporting rejected sends as success.

## Checks

- `npm run build`: pass, including TypeScript and static generation of `/codex-landing` (installed Next.js 16.1.4).
- `node --test scripts/test-contact.cjs`: 4 passing tests covering acceptance, rejection/missing receipt, invalid input, and configuration/provider exceptions. Injected provider, no real email.
- Focused ESLint: pass for `app/codex-landing`, `app/api/contact/route.ts`, and `middleware.ts`, using the installed Next native flat exports in a temporary config. The repository's `npm run lint` fails before examining files because its pre-existing FlatCompat setup produces a circular React config error; tracked in issue #3. No global tooling change included.
- Six contact browser scenarios pass: required/email/whitespace validation, actual unconfigured endpoint failure, malformed success response, pending/duplicate protection/accepted reset, HTTP failure, and network failure. Success/error network responses were intercepted, except the local no-credentials error. Fields are retained on failure. See [results](contact-results.json).
- Production-build browser checks: no overflow at 320, 390, 768, 1440 pixels; exact URL with no locale redirect; valid internal anchors and metadata; no page errors. Automated axe WCAG 2 A/AA and 2.1 AA scan of `.kl-page` returned no violations. See [layout results](layout-results.json).
- Desktop and iPhone 13 Chromium emulation: service map selection by pointer and keyboard, immediate keyboard state changes, FAQ Enter toggle, contact anchor, skip-link focus, and stable reduced-motion hover all pass. `/en`, `/he`, `/777`, and `/codex-landing` return HTTP 200 without redirects. See [interaction results](interaction-results.json). Emulation does not establish physical-device or VoiceOver behavior.
- Header follow-up: Hebrew logo is aligned to the far right, with the contact CTA on the left. Verified at 320/390/768/1440px, without overflow; see [header results](header-results.json). Build and focused lint pass. Screenshots updated and the existing in-app preview refreshed.

The browser harnesses used transient Playwright and axe tooling outside the repository. Screenshots below were taken against the local production build, after scrolling to load and decode the existing project images.

## Complete Hebrew version

- `/he/codex-landing` uses the existing Hebrew root layout and Heebo font, with translated navigation, hero, service map, services, process, project captions/alt text, FAQ, footer, and form labels/placeholders/validation/pending/success/error messages.
- Language links stay visible on mobile and navigate between the Hebrew route and exact English `/codex-landing`. English locale-prefixed duplicate redirects to the canonical English route.
- RTL mirrors layout and directional icons while keeping the Hebrew logo at the physical right. Email addresses and domains remain LTR. Canonical URLs, hreflang, Open Graph/Twitter text, and sitemap language alternates are localized.
- Production-build checks pass at 320/390/768/1440px: no overflow, logo on right, language round trip, diagram selection, FAQ keyboard interaction. Desktop and mobile automated WCAG scans report zero violations; zero browser page errors. Hebrew native required/email messages, pending, accepted/reset, real missing-credentials error, input retention, and reduced motion pass. All six original English contact scenarios also pass. See [Hebrew results](hebrew-results.json).
- Remaining legacy Hebrew blog/UI translations are handled separately in issue #8, stacked on this landing work.

[Hebrew desktop](hebrew-desktop.png) · [Hebrew mobile](hebrew-mobile.png)

## Emil Kowalski animation review

Applied the official [design engineering](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng), [animate](https://github.com/emilkowalski/skills/tree/main/skills/animate), and [review-animations](https://github.com/emilkowalski/skills/tree/main/skills/review-animations) skills. The initial stagger explains the marketing page hierarchy; hover and press feedback confirm interactions. No repeated or automatic motion.

| Before | After | Why |
| --- | --- | --- |
| Animated node shadow | Static selected shadow | Avoid painting shadows during movement. |
| Project hover at 350ms | 220ms transform transition | Keep UI feedback within the animation budget. |
| Reduced motion stopped durations but changed transforms | Interactive movement gated by motion preference and fine pointer | Preserve resting rotations without snapped hover movement. |
| Keyboard map selection transitioned | Immediate state change when focus-visible | Keep keyboard interaction immediate. |

Review verdict after fixes: **Approve**. Browser verification confirms keyboard and reduced-motion behavior.

## Limits and release status

Local provider credentials were not copied. The actual contact endpoint returns `Email service not configured` in this preview and the form shows a recoverable error. Provider acceptance is tested with an injected provider; inbox delivery remains unverified. Production requires its existing valid email configuration. No real email, production deployment, or merge was performed. PR remains draft because the repository lint command is blocked by #3.

## Screenshots

![Desktop hero](desktop-hero.png)

[Full desktop page](desktop.png) · [Full mobile page](mobile.png) · [iPhone emulation viewport](mobile-hero.png)

## Header caption removal follow-up

Removed the English “AI, with purpose.” caption and its Hebrew counterpart, plus the header divider and unused copy/styles. The logo remains at the physical right. Footer copy is unchanged. Production build, focused native Next ESLint, and `git diff --check` pass. Browser checks at actual CSS widths 1800px and 487px confirm both language headers have no caption/divider or document overflow. See [results](header-caption-results.json) and [updated header](header-caption-removed.png); the `header-caption-*` screenshots supersede earlier header captures.

## Right-aligned footer logo follow-up

The footer logo now sits at the physical right in English and Hebrew. The tagline sits to its left. Production build, focused native Next lint, and diff checks pass. Browser checks at actual CSS widths 1800px and 487px verify the logo position and no horizontal overflow in both languages. See [results](footer-right-results.json), [English desktop](footer-right-english-desktop.jpg), [Hebrew desktop](footer-right-hebrew-desktop.jpg), [English mobile](footer-right-english-mobile.jpg), and [Hebrew mobile](footer-right-hebrew-mobile.jpg). These captures supersede the footer layout in earlier full-page screenshots.

## Robot King hero — final verification

The approved Robot King now sits directly on the page background in both languages. The real-alpha 1254px WebP is 246,120 bytes; the verified 640px negotiated AVIF response is 48,667 bytes with alpha preserved. The image is responsive, prioritized, uncropped and unmirrored, with localized alt text. Retired map code/copy/styles are removed; the landing is server-rendered while its contact form remains client-side.

- Production build and TypeScript pass across all 26 routes. Focused native Next lint and `git diff --check` pass. The full `npm run lint` reproduces the existing circular FlatCompat configuration error (#3/#7).
- Eight browser layout checks cover English/Hebrew at 320, 390, 768 and 1440px: loaded image, square dimensions, object-fit contain, localized alt/direction, no retired map, no horizontal overflow, header/footer logos remain at the physical right.
- Browser keyboard checks pass for both FAQ languages, skip-link focus, contact anchor, language switching and empty required-form validation. No form data was sent. Browser error log is empty.
- Existing reduced-motion and fine-pointer hover gates remain intact. The artwork has only the existing first-view 550ms entrance (transform/opacity, custom ease, 160ms delay), with no ongoing movement. Reduced-motion handling was reviewed in source; this follow-up does not add a new browser media-emulation test.
- Exact standalone English/Hebrew routes and direct/optimized image requests return HTTP 200.

[Browser results](robot-king-results.json) · [English desktop](robot-king-english-desktop.jpg) · [English mobile](robot-king-english-mobile.jpg) · [Hebrew desktop](robot-king-hebrew-desktop.jpg) · [Hebrew mobile](robot-king-hebrew-mobile.jpg)

Hebrew captures retain the in-app browser canvas context. Earlier diagram and footer captures remain historical evidence.

### Emil animation review for this change

| Before | After | Why |
| --- | --- | --- |
| Stateful interactive hero map | Server-rendered mascot image; form stays client-side | Removes unnecessary state and hydration. |
| Fixed canvas heights and RTL map mirroring | Responsive square artwork, unmirrored | Preserves the approved character in both languages. |
| Map entrance | Existing restrained artwork entrance | Uses transform/opacity and preserves reduced motion; adds no ongoing animation. |

Independent source-review verdict: **Approve**. No actionable findings. No production deployment, merge, or live email verification performed.

## Header flag dropdown

The contact CTA is followed by a flag dropdown in each language’s reading order. The current language flag appears on the trigger; the menu contains English and עברית with flags and a current-page check. Installed Radix DropdownMenu supplies keyboard focus, arrow navigation, Escape and outside dismissal. Inline content retains the landing’s scoped colors and fonts. Both header controls have 44px minimum heights; narrow layouts retain a single-line contact CTA.

- Production build/TypeScript, focused native Next ESLint and diff checks pass. Full `npm run lint` still fails before source checks on existing #3/#7.
- Eight production-browser checks pass at 320/390/768/1440px in both languages, with the flag after the CTA, right-side logo and no horizontal overflow.
- Pointer, Enter, Space and ArrowDown opening/navigation, Escape focus restoration in both languages, outside dismissal, language round-trip and contact-anchor dismissal pass. Browser error log is empty. No form data sent.
- No new menu animation: keyboard state changes are immediate. Existing reduced-motion support remains; reviewed in source, without a new media-emulation test.

[Results](language-dropdown-results.json) · [English desktop](language-dropdown-english-desktop.jpg) · [English mobile](language-dropdown-english-mobile.jpg) · [Hebrew desktop](language-dropdown-hebrew-desktop.jpg) · [Hebrew mobile](language-dropdown-hebrew-mobile.jpg). Hebrew captures retain browser canvas context.

### Emil animation review

| Before | After | Why |
| --- | --- | --- |
| Plain language link | Immediate flag menu | Keyboard-initiated state changes remain immediate. |
| Switch before CTA | CTA followed by flag trigger | Preserves each language’s reading order. |
| No menu controls | Scoped 44px controls, static pointer-gated hover feedback | Clear state and adequate touch targets without added motion. |

Independent review verdict: **Approve**, with no actionable source findings. Browser verification passes after the narrow-width spacing fix.
