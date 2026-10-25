# Issue #19 — natural motion and matte finish

Source commit: `ee66809`. Production build preview:

- http://127.0.0.1:3019/codex-landing
- http://127.0.0.1:3019/he/codex-landing

## Validation

- `npm run build`: pass; TypeScript and all 26 routes.
- Focused native Next ESLint on all seven changed TypeScript/TSX files: pass.
- `git diff --check`: pass.
- `node --experimental-strip-types scripts/test-robot-choreography.ts`: pass; real GLB floor contact, hand reach, task timing and dense quaternion continuity.
- `node --experimental-strip-types scripts/test-robot-hurdle.ts`: pass; physical obstacle overlap/clearance, timing and loop.
- `node --experimental-strip-types scripts/test-robot-natural-motion.ts`: pass; actual GLB rest-transform guards, forward gaze, head roll, steady stance speed, arm/leg opposition and stride/story boundary continuity.
- `node --experimental-strip-types scripts/test-robot-materials.ts`: pass; 49 mesh bindings, all four authored textures, material profile separation, cape shader composition and idempotence.
- `npm run lint`: existing circular FlatCompat React configuration failure (#3/#7), before source inspection. PR remains draft.
- Independent official Emil review: structural approval. Detailed findings and local feel review are in `animation-review.md`.

The new poster was generated using headless Blender and `tools/robot-king/render_matte_poster.py`, then visually inspected. Both PNG/WebP alpha span 0–255; the 1280px transparent WebP is 89,504 bytes. Editable Blend and delivery GLB are unchanged.

## Browser evidence

The production build was inspected at full speed, quarter speed and held poses. EN and HE were checked at CSS widths 320, 390, 768 and 1440, with no horizontal overflow. The hurdle jump stays in frame, four services remain visible and Selected work remains hidden. No browser warning/error was captured. Offscreen playback held its pose time. Existing reduced-motion/visibility behavior was checked in source; the browser reported no reduced-motion preference, and system preference switching was not repeated.

- `en-run.png`, `en-jump.png`, `en-coding.png`, `en-automation.png`, `en-acknowledge.png`: desktop page context for each beat.
- `he-desktop-jump.png`, `en-mobile-jump.png`, `he-mobile-jump.png`: bilingual framing and hero context.
- `run-stride.gif`: one 0.63s stride, assembled from 21 actual browser-held frames at 30ms pose intervals. Frame crops follow the stage bounds; no pixels were painted or retouched. This is a pose-sequence preview rather than a live frame-rate recording.
- `run-pose-00.png`, `05`, `10`, `15`: selected frame crops.
- `stride-frame-measurements.json`: exact held pose times, opacity and stage bounds.
- `browser-qa.json`: responsive, state, performance and console observations.

Browser zoom was 80%; screenshots include the browser's canvas margins. The temporary viewport override was reset, the QA tab closed, and the normal full-speed preview opened for review. No visible pause control was added. No paid generation, live contact submission, merge or production deployment was performed.
