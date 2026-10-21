# Continuous running follow-up

The Robot King now runs in place indefinitely while visible and playing. An articulated 0.82-second cycle replaces the earlier idle motion: opposing hip and shoulder swings, bending knees, ankle compensation, torso lean/bounce, head counterbalance, cape movement and trailing data tiles. Pause/Play, reduced-motion handling, hidden/offscreen suspension and resource cleanup remain in place.

The updated Blender rig adds separate hip, knee, ankle and cape pivots, bent elbows and compact fists. Its neutral GLB is **833,396 bytes**, with 46,940 triangles, 17 meshes, 64 material primitives and 35 nodes. The matching running-pose WebP is **105,298 bytes**. The editable studio shows a running key pose; runtime animation is defined in `robot-run-cycle.ts`, without baked GLB clips.

## Verification

- `npm run build` passes TypeScript and all 26 routes. Focused native Next ESLint and `git diff --check` pass. Full `npm run lint` retains the existing #3/#7 circular configuration failure.
- [Gait assertions](gait-results.json) evaluate 241 samples: repeated periods agree within floating-point precision, left/right limbs oppose exactly, knee bends remain nonnegative, transforms are finite, and adjacent rotation steps are smooth.
- [Actual GLB rig sweep](rig-results.json) verifies all 11 body/limb/cape pivots through 24 poses. Precise boot vertex bounds remain above the renderer’s contact-shadow plane throughout the sampled cycle.
- Independent projection review sampled 1,440 poses and confirmed that all fit inside the fixed 24-sample envelope plus its 12% margin. Camera framing stays stable through the stride and responsive resizes.
- Blender reimport verifies neutral transforms, joint hierarchy, geometry budgets and two visibly opposite strides: [stride A](blender-stride-a.png), [stride B](blender-stride-b.png).
- Production-browser checks cover English/Hebrew at 320/390/768/1440px: ready real canvas, no overflow, mobile controls below the stage and preserved right-side logo. Enter/Space pause/resume and visible keyboard focus pass in both languages; the flag menu completes the language round-trip.
- Browser screenshot comparisons verify changed artwork while running and identical artwork while paused. See the paired captures and pixel results.

Source review confirms unchanged reduced-motion preference handling and hidden/offscreen RAF cancellation. This follow-up does not introduce new system-preference/context-loss emulation or physical-device performance tests.

## Emil animation review

| Before | After | Why |
| --- | --- | --- |
| Idle offsets | Periodic articulated run | Literal running motion requested by the user; endpoints and limb phase agree. |
| Neutral-pose camera fit | Fixed full-stride envelope | Keeps boots, fists, cape and crown visible without camera pumping. |
| Static legs and posed hands | Hip → knee → ankle hierarchy and bent pumping arms | Gives the stride recognizable mechanics. |
| Existing playback safeguards | Preserved immediate controls and preference/visibility handling | Keeps continuous motion controllable. |

Independent final review: **Approve**, no actionable findings.

[English desktop](english-desktop.jpg) · [English mobile](english-mobile.jpg) · [Hebrew desktop](hebrew-desktop.jpg) · [Hebrew mobile](hebrew-mobile.jpg)

These captures supersede the earlier idle-animation screenshots. Hebrew captures retain the in-app browser canvas context. Local combined preview remains port 3103; PR #12 stays draft for the existing lint blocker. No merge or production deployment.
