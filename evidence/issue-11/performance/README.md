# Robot King — articulated character performance

Implementation: `238e1be`. Replaces the previous 14.4-second action story with a **20.16-second infinite performance**, on both `/codex-landing` and `/he/codex-landing`.

Subsequent UI refinement: the visible playback button was [removed at Itai’s request](../no-playback-control/README.md). The control screenshots and keyboard tests below document the preceding version. Automatic reduced-motion handling remains.

## What changed

- Rebuilt the Blender rig with **28 controls**, including independent torso, elbows, wrists, eyes, brows and smile. The matte sandstone, mineral cobalt and brushed antique gold identity remains.
- A **0.48-second sprint stride** has authored support, compression, toe-off, heel recovery and flight phases. Leg IK and measured boot support geometry keep contact points grounded. Pelvis and torso counter-rotate; head/gaze lead the banking turn.
- The jump has anticipation, takeoff, a ballistic arc, tucked legs, touchdown and knee absorption. Ground impact cues start after contact.
- The laptop opens on a hinge. Hands reach the actual keyboard, alternate typing, and press Enter; code progressively appears after the lid opens.
- The workflow assembles, the hand grabs and drags an actual node, then presses its activation control. Wires follow their endpoints in 3D; packets follow activation and a completion mark follows the flow.
- Continuous gaze, blinks and facial weights support focus, surprise and satisfaction. Bounded cape deformation, trailing tiles, ground streaks and a brief landing ring provide secondary motion.
- The fixed camera fits the full story. No per-frame camera zoom, postprocessing or realtime shadow map was added. Native display cadence, adaptive DPR, shader precompilation and lifecycle safeguards are retained.

Running uses implied moving ground and limited stage travel. It is a treadmill-style hero performance, not a character traversing a continuous world.

## Asset

- GLB: **1,607,940 bytes**, **40,892 triangles**, 27 rigid meshes, 49 material primitives, 55 nodes / 28 controls.
- Three shared delivery materials; four embedded 128px surface maps. Independent face/joint controls increase material primitives from the preceding 35 to 49; the richer rig is intentional.
- Matching transparent 1280px poster: **81,510 bytes**.
- Editable source, reproducible builder, metadata and roundtrip verifier: [tools/robot-king](../../../tools/robot-king).
- Built and export/reimport verified with headless Blender 5.2.1. No paid generation or external model asset.

## Checks

- `npm run build`: **pass**, TypeScript and all 26 routes.
- Focused installed native Next flat ESLint on the six changed frontend/test files: **pass**. `git diff --check`: **pass**.
- `npm run lint`: existing circular FlatCompat React configuration failure before source inspection (#3/#7). No lint tooling change is included; PR #12 stays draft.
- `node --experimental-strip-types scripts/test-robot-choreography.ts`: **pass**. [Saved results](motion-results.json) include 2,017 math samples, full loop position/velocity checks, task ordering, actual-GLB support/contact checks, hand targets and 4,839 sampled physical poses. Minimum floor clearance: 0.00200019 model units; maximum support-target error: 0.00000534 units.
- Blender source/export checks and actual GLB reimport renders: **pass**.
- Independent source/motion review: **Approve**. Dense 7,200-pose camera sweep, cape displacement/normal bounds, lifecycle and resource disposal reviewed. [Emil animation review](animation-review.md).
- Optimized production-browser checks at actual CSS widths **320 / 390 / 768 / 1440** in English and Hebrew: a real animated canvas, correct page language/direction, right-side header logo and **no horizontal overflow**. Mobile playback control remains below the artwork. [Browser measurements](browser-results.json).
- Enter/Space pause/resume and visible focus: **pass in both languages**. Flag dropdown returns to exact `/codex-landing`; contact link reaches `#contact`. No form data submitted. [Keyboard/navigation record](keyboard-navigation.json).
- Artwork-only screenshot comparison: **75,978** pixels differ by more than 12 while playing; **zero** differ while paused, in the same 715 × 715 raster region. [Pixel results](motion-pixel-results.json).
- Final optimized desktop sample: **143.9fps**, **0.37ms CPU submission/update**, DPR 0.80, 50 draw calls / 40,894 triangles without active task props. Error/warning log empty. [Runtime sample](runtime-results.json). This is one Mac/display configuration, not GPU timing or a phone performance guarantee.
- The refreshed normal preview on port 3103 reports `robotState=ready`, `playing=true`, with no console warnings/errors.

Reduced-motion preference handling, hidden/offscreen suspension and context-loss fallback were source-reviewed and retained. Those system events were not newly emulated in this pass. Responsive viewport testing does not establish physical phone performance. Earlier failure-fallback checks are retained in the parent evidence directory.

## Browser evidence

| Action | Screenshot |
| --- | --- |
| Sprint and foot strike | [Sprint](sprint-desktop.jpg) |
| Strong bank / cape follow-through | [Turn](banking-turn-desktop.jpg) |
| Airborne leg tuck | [Jump](jump-desktop.jpg) |
| Independent hands at keyboard | [Coding](typing-desktop.jpg) |
| Hand dragging a workflow node | [Automation](workflow-drag-desktop.jpg) |
| Task acknowledgment | [Reaction](acknowledgment-desktop.jpg) |
| Responsive English | [Mobile](english-mobile.jpg) · [Desktop](english-desktop.jpg) |
| Responsive Hebrew | [Mobile](hebrew-mobile.jpg) · [Desktop](hebrew-desktop.jpg) |
| Refreshed normal preview | [Local preview](local-preview.jpg) |

Action screenshots use quarter-speed diagnostic playback, paused after the requested pose. Browser checks use the optimized production build. Normal visitors run at full speed; diagnostic query controls are opt-in.

## Preview and review

[English preview](http://127.0.0.1:3103/codex-landing) · [Hebrew preview](http://127.0.0.1:3103/he/codex-landing) · [PR #12](https://github.com/itaibiton/kohelet/pull/12)

Stack order: #5 → #9 → #12. Only Itai merges and deploys. Neither action was performed.
