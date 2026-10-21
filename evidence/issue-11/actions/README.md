# Matte Robot King action loop

Implementation: `07f2d14` on issue #11 / PR #12. Local production preview: `http://127.0.0.1:3103/codex-landing` and `/he/codex-landing`. No merge or production deployment.

## Delivered

- Matte sandstone armor, mineral cobalt and brushed antique gold, with four original embedded 128px normal/roughness maps.
- Character: 39,676 triangles, 35 material primitives (previously 46,940 / 64), three shared standard materials. GLB 1,521,284 bytes; matching transparent poster 84,930 bytes. All rig controls retained.
- Seamless 14.4s story: faster 0.6s strides, jump anticipation / flight / landing, laptop typing, workflow connection gestures, and return to the run. Stronger running yaw, forward lean, cape response and jump shadow.
- Native RAF cadence replaces the 30fps cap. Adaptive resolution, precompiled shaders, no per-frame React updates, merged workstation geometry and one-time screen artwork. Existing playback, reduced-motion, offscreen and hidden-tab safeguards retained.

## Verification

- `npm run build`: pass, TypeScript and all 26 routes.
- Focused native Next ESLint on changed frontend files and `scripts/test-robot-choreography.ts`: pass. `git diff --check`: pass.
- Full `npm run lint`: existing FlatCompat circular React configuration failure before checking source (#3/#7). PR remains draft.
- `node --experimental-strip-types scripts/test-robot-choreography.ts`: 1,441 mathematical samples; periodic values/velocity, finite transforms, forward running and task holds pass. Actual exported GLB: 721 poses, minimum foot clearance 0.00834 above the contact plane. See `choreography-results.json`.
- Separate Blender export/reimport verification: front, reverse stride and rear render; texture, tint, culling and geometry budgets pass.
- Independent animation review using Emil Kowalski's `review-animations`: approve after correcting backward stage drift. Dense 2,880-pose projection includes props; maximum missed extent 0.02192 units fits within 0.30522 units of padding. No lifecycle, pause or reduced-motion source findings.
- Production browser: English/Hebrew at actual CSS widths 320/390/768/1440; ready canvas, correct direction, no overflow. Mobile control below artwork. See `browser-results.json`.
- Keyboard Enter/Space playback and visible focus: pass. Screenshot comparison proves movement while playing and identical frames while paused. See `keyboard-results.json` and `motion-pixel-results.json`.
- Sustained local production playback: 144fps native cadence, 0.28ms average CPU render submission at display ratio 0.80, 36 draws during running. Artwork-only comparison: 16,217 changed pixels above threshold while playing, zero while paused. See `performance-results.json`.
- Four action screenshots show actual browser-rendered run, jump, coding and automation states. Diagnostic `robot-start` chooses the initial story time; screenshots are paused through the real UI, without injecting a pose into the browser.

Browser timings are measured on this Mac at its current zoom/display ratio, and measure CPU render submission, not complete GPU execution. They do not guarantee a frame rate on other hardware. System reduced-motion preference changes, offscreen/hidden suspension and context loss were reviewed in source; those system events were not newly emulated in this pass. No physical phone test, live email submission, paid service call or deployment.

## Screenshots

- `english-running.jpg`, `english-jump.jpg`, `english-coding.jpg`, `english-automation.jpg`: action storyboard with page context.
- `en-desktop.jpg`, `he-desktop.jpg`, `en-mobile.jpg`, `he-mobile.jpg`: responsive language previews.
- `playing-a/b.jpg`, `paused-a/b.jpg`: pixel comparison evidence.
