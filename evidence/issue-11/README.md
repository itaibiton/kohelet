# Animated Blender Robot King — issue #11

Latest version: [matte Robot King action story](actions/README.md), with faster running, jumping, coding, automation and rendering improvements. The [previous running evidence](running/README.md) and the idle evidence below are retained as historical records.

The hero now renders an original Blender model through the existing Three.js dependency on `/codex-landing` and `/he/codex-landing`. The crown, digital visor, hands, armor, cape and data tiles are actual mesh geometry. Named pivots drive restrained head/body/arm movement and floating tiles; runtime motion is authored in TypeScript, with no baked GLB animation.

## Delivered assets

- GLB: **840,708 bytes**, 45,192 triangles, 10 meshes, 42 material primitives, 21 nodes and 13 PBR materials. No external textures.
- Matching transparent 1280px WebP poster: **122,004 bytes**.
- Editable Blender source: **511,095 bytes**, plus reproducible builder and export roundtrip verifier in [tools/robot-king](../../tools/robot-king).
- Built in an isolated headless Blender 5.2.1 process. Original custom geometry follows the approved Robot King direction; no stock asset or paid generation. Existing open Blender scenes were untouched.
- Export reimported into Blender and rendered from [front](blender-model-front.png) and [back](blender-model-back.png). All expected pivots, geometry and size limits pass.

## Checks

- `npm run build` passes TypeScript and all 26 routes. Focused ESLint using installed native Next flat exports and `git diff --check` pass.
- Full `npm run lint` reproduces the existing circular FlatCompat configuration failure (#3/#7), before source inspection. No tooling changes included.
- Eight local production-browser checks cover English/Hebrew at 320/390/768/1440px. Each has a ready real canvas, no horizontal overflow, a right-side header logo and retained flag dropdown. Mobile controls sit fully below the stage, clearing the model.
- Pointer and Enter/Space Play/Pause work in both languages with visible keyboard focus. Language switching returns to exact English `/codex-landing`; the Hebrew contact CTA reaches its contact section. No form data was sent.
- Settled screenshots prove actual movement while playing and exact pixel stability while paused. In the same 568 × 510px artwork region, playing frames contain 54,662 pixels with difference greater than 12; paused frames are identical. See [pixel results](motion-pixel-results.json) and the paired `playing-*` / `paused-*` captures.
- A temporary local proxy deliberately returned HTTP 503 for the model. The browser restored the loaded poster at opacity 1, removed the canvas and hid the unusable playback control. See [failure screenshot](model-failure-fallback.jpg).
- Main preview browser error log is empty. GLB and poster return HTTP 200 with the measured bytes.
- Rendering is limited to 30fps and DPR 1.5. Source review verifies cancellation while paused, hidden or offscreen; aborted fetch/late load cleanup; geometry/material/texture/environment disposal; context-loss fallback.

[Detailed browser results](browser-results.json) · [English desktop](english-desktop.jpg) · [English mobile](english-mobile.jpg) · [Hebrew desktop](hebrew-desktop.jpg) · [Hebrew mobile](hebrew-mobile.jpg)

English screenshots use the page viewport. Hebrew screenshots retain the in-app browser canvas context. Mobile viewport captures are 390 × 1250px, with additional 320/768/1440 checks in JSON. Viewport emulation does not establish physical-device performance.

## Emil Kowalski animation review

Applied the official design engineering, animate and review-animations skills already used for this landing. Gate: rare marketing delight and explanation of floating data; no movement of readable content or whole-character spin. The WebGL scene uses small saved-transform offsets; UI controls update immediately with no added keyboard animation.

| Before | After | Why |
| --- | --- | --- |
| Static illustration | Actual GLB with gentle named-pivot animation | Adds real depth and motion while retaining the character direction. |
| Sphere-based camera and realtime shadows | Tight orthographic fit and static soft contact shadow | Fills the hero and removes jagged shadows/GPU cost. |
| Generic accessible control name | Visible Play/Pause action plus localized context | Supports screen readers and voice control. |
| Manual play survived repeated preference changes | Every native preference event clears the manual override | Enabling reduced motion consistently restores a static scene. |
| Mobile button overlapped a boot | Control below the canvas on mobile | Keeps the full model visible and the control reachable. |

Independent final source-review verdict: **Approve**. All reported findings resolved.

Initial reduced-motion static rendering was independently checked in headless Chrome before the final preference-reset fix. The final preference-change logic, visibility suspension and context-loss cleanup were reviewed in source; those system events were not manually induced in the final browser. Model-fetch failure, manual pause/play and navigation were exercised in the production browser.

## Review and preview

Stack order: PR #5 → PR #9 → PR #12. Local combined preview: [English](http://127.0.0.1:3103/codex-landing) / [Hebrew](http://127.0.0.1:3103/he/codex-landing). The PR remains draft because of the existing full-lint blocker. Itai merges and deploys; neither action was performed.
