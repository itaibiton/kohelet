# Robot King scenery animation review

Scope: the technology hurdle, flying documents/components, wind ribbons, and their integration into `RobotKingScene.tsx`. Review follows Emil Kowalski’s official `emil-design-eng`, `animate`, and `review-animations` skills. Measurements below use the final source with hurdle travel of ±2.15 units and single-pass wind rendering.

| Before | After | Why |
| --- | --- | --- |
| Jump had no physical obstacle | A six-draw circuit-board hurdle passes beneath the airborne robot and exits before the work scene | Gives the jump a technological purpose and a visible spatial relationship. |
| Initial hurdle approach travelled ±2.8 units | Approach travels ±2.15 units | Recovers mascot size while retaining reported actual-GLB clearance of approximately 0.415 units, and 0.736 units at the apex. |
| Background depended on the character’s original small tiles | Instanced folded documents, chips, gears and connectors occupy fixed scenery behind the turning character | Adds depth without parenting the environment to the robot’s movement. |
| Transparent, double-sided wind required two passes | `forceSinglePass` keeps all atmosphere geometry to nine draws | Avoids an unnecessary wind pass; ribbons use shader opacity rather than geometry rebuilding. |
| Faster scenery motion could risk a visible loop reset | Position, flutter, gear and wind frequencies use integer multiples of the story period | Physical matrices and opacity match at the 20.16-second seam. |
| Character-only camera fit | Existing 360-pose fit includes the new hurdle and current instance bounds | The full composition fits without a moving camera or changing frame during playback. |

## Independent measurements

The dense sweep evaluated **7,200 poses** against the runtime’s **360-pose** envelope, including the 55-node character, 22 animated controls, five facial controls, task props, expanded cape bounds, instanced ground effects, atmosphere, and hurdle.

| Measurement | Result |
| --- | --- |
| Maximum missed horizontal extent | 0.000000842 model units |
| Maximum missed vertical extent | 0.002142875 model units |
| Available padding per horizontal side | 0.357025 model units |
| Available padding per vertical side | 0.360291 model units |
| Square-stage camera width/height | 6.725426 model units |
| Previous character-only square frame | 6.101042 model units |
| Atmosphere/visible-hurdle periodicity | Exact matrix/opacity equality at ten phases compared with time +20.16 seconds |
| Largest seam matrix change across ±1 microsecond | 0.000003114 |

The mascot is approximately **9.3% smaller** than in the character-only frame. The initial scenery fit would have reduced it by approximately 16%; the shorter approach recovers much of that space. This remaining composition tradeoff should be judged in the browser.

Visible geometry was sampled over **2,017 story times** to estimate the complete renderer budget. Counts include the contact shadow and applicable transparent double-sided passes; they are source-derived submission estimates, not browser GPU timings.

| Story time / state | Draw calls | Triangles |
| --- | ---: | ---: |
| 0.00s — sprint | 60 | 44,096 |
| 3.20s — approach | 66 | 44,636 |
| 4.00s — jump apex | 65 | 44,576 |
| 4.60s — landing | 67 | 44,756 |
| 7.00s — coding | 65 | 45,276 |
| 13.70s — automation | 65 | 45,068 |
| 5.09s — brief hurdle/workstation overlap, maximum | 71 | 45,816 |

## Source checks and limits

- Wind UV access is valid in the installed Three.js shader prefix. Its custom shader changes opacity only, so static ribbon bounds remain valid.
- Animated instance bounds are refreshed and included in camera fitting. The hidden hurdle reset does not appear onscreen.
- New materials are present for asynchronous shader preparation. Geometry, instance resources and materials are covered by the existing disposal traversal and shared-resource deduplication.
- Updates construct no new geometry and upload no textures. Instanced transforms reuse scratch objects.
- System reduced-motion behavior remains connected to `prefers-reduced-motion` in `RobotKing.tsx`; all scene effects share the same stopped animation clock. Offscreen and hidden-tab suspension remain intact. The removed manual playback button has not been reintroduced.
- This source/framing review does not establish physical-mobile performance or substitute for the root’s final production-browser visual and timing checks. No physical mobile performance claim is made.

## Verdict

**Approve source, continuity, lifecycle and framing correctness.** No remaining blocking finding. Final browser QA should confirm that the additional scenery supports the mascot at desktop and mobile sizes and that measured playback remains smooth on the tested setup.
