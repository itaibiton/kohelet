# Technological hurdle and flying scenery

Implementation: `d4a6153`, on `/codex-landing` and `/he/codex-landing`.

The jump now clears a physical circuit-board hurdle. The cobalt PCB has processor packages, exposed gold traces/pins and sandstone support brackets. It approaches before takeoff, passes under the tucked feet at 4.0 seconds, and leaves after landing. Its world-space lane is independent of the jumping robot.

Behind the character are three folded documents with raised corners and ink, two etched microchips, two cogwheels, two connector heads and three curved wind ribbons. Position, flutter, gear rotation and wind pulses use whole-number frequencies of the existing 20.16-second story, so they loop without a visible reset. The wind is livelier during running and the scene calms during task work.

All additions are original procedural Three.js geometry. No new asset download, dependency, paid generation or GLB payload increase. The matte paper/cobalt/gold palette follows the existing character. The playback button stays removed.

## Verification

- `npm run build`: **pass**, TypeScript and all 26 routes.
- Focused installed native Next ESLint on changed scene, geometry, copy and test modules; `git diff --check`: **pass**.
- Full `npm run lint`: same existing circular FlatCompat React configuration failure before source inspection (#3/#7); PR #12 remains draft.
- `node --experimental-strip-types scripts/test-robot-hurdle.ts`: **pass**, 2,017 actual-GLB poses, 671 boot/obstacle overlap checks. Minimum passing vertical clearance **0.415236 model units**; apex clearance **0.735682**. The hurdle is 0.425 units high. Visible transforms/opacity are continuous and periodic; the obstacle leaves before work scenes.
- Independent final **7,200-pose** envelope sweep against the runtime's 360-pose fit: maximum missed extent **0.000000842 X / 0.002142875 Y**, well within **0.357025 X / 0.360291 Y** per-side padding. Atmosphere and visible hurdle matrices/opacity repeat exactly. [Emil animation review](animation-review.md).
- The atmosphere uses **9 draws / 3,142 triangles**. The hurdle uses six merged draws. Estimated full scene: 60 draws / 44,096 triangles in the sprint; brief maximum 71 / 45,816 during the hurdle/workstation transition. Single-pass wind avoids a redundant transparency pass. Existing traversal disposes all new mesh/instance/material resources.
- Final production-browser English and Hebrew at actual CSS widths **320 / 390 / 768 / 1440**: ready playing canvas, correct language/direction, zero mascot buttons and no horizontal overflow. [Measurements](browser-results.json).
- Reviewed the hurdle approach, airborne clearance, landing and coding composition in the production browser. [Pose record](pose-results.json).
- Normal-speed desktop sample: **144.0fps**, **0.59ms CPU submission/update**, DPR **0.80**, **60 draws / 44,096 triangles**. Browser error/warning log empty. [Runtime record](runtime-results.json). This is one Mac/display setup; CPU timing is not GPU timing or a phone performance guarantee.
- Matched screenshot regions contain **57,122 pixels** differing by more than 12 during playback in the same 715 × 715 raster area. [Motion comparison](motion-pixel-results.json).
- Main preview on port 3103 was restarted with the final optimized build, confirmed ready/playing, with no warnings/errors. Temporary development/QA servers and tabs were closed.

The fixed camera includes the new scenery; the robot is approximately 9.3% smaller than in the earlier character-only frame. Desktop/mobile inspection confirms the character and obstacle remain legible. System reduced-motion, offscreen/hidden suspension and cleanup remain source-reviewed; those system events were not newly emulated. No physical mobile performance test or live form submission was performed.

## Screenshots

[Jump in page](jump-desktop.jpg) · [Approach](approach-desktop.jpg) · [Landing](landing-desktop.jpg) · [Coding](coding-desktop.jpg)

[English mobile](english-mobile.jpg) · [Hebrew mobile](hebrew-mobile.jpg) · [Hebrew desktop](hebrew-desktop.jpg)

Pose screenshots use the existing opt-in diagnostic playback at one-tenth speed. Normal visitors run at full speed. The jump and Hebrew screenshots retain browser canvas context to avoid the browser screenshot tool's clipping issue.

[English preview](http://127.0.0.1:3103/codex-landing) · [Hebrew preview](http://127.0.0.1:3103/he/codex-landing) · [PR #12](https://github.com/itaibiton/kohelet/pull/12)

Merge order remains #5 → #9 → #12. Only Itai merges and deploys; neither action was performed.
