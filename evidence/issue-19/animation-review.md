# Robot King motion review — issue #19

Reviewed using Emil Kowalski's official [design engineering](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md), [animate](https://github.com/emilkowalski/skills/blob/main/skills/animate/SKILL.md) and [review-animations](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md) skills, including its standards reference. Fetched skill revision: `2d228630ba1446365f614a108cb8252f1feda202`.

The gate is a marketing explanation: the character moves forward, clears an obstacle and performs coding/automation tasks. The user explicitly requested a repeating performance. This is a Three.js character transform/shader sequence, separate from interface feedback; UI duration budgets do not describe a physical stride or jump. Existing reduced-motion and offscreen/hidden-tab suspension remain in place.

| Before | After | Why |
| --- | --- | --- |
| Fast 0.48s stride, broad arm swings and sharp ankle pitch changes | 0.63s stride, steady support, flowing recovery and compact opposing hand arcs | Gives weight transfer time to read and avoids stopping at every stride key. |
| Exported head tilt compounded with torso rotation; sideways turn and eye dart | Actual-hierarchy head stabilization and a consistent lane heading; eyes attend to the active task | Keeps gaze within 1.18 degrees of forward during the run without making the shoulders rigid. |
| Strong highlights on gold and mineral shell | Authored maps retained, roughness remapped, environmental reflections reduced and lights softened | Produces a matte finish while keeping warm colors and tactile grain. |
| Loading/fallback used the former studio finish | Genuine new transparent Blender render with the same character, matte finish and forward gaze | Gives the loading/failure image a consistent material direction. |

**Origin, physicality and cohesion:** No unresolved structural blocker. Actual GLB tests cover gaze, head roll, steady support-foot speed, opposing arm/leg motion, planted task feet, accurate hand targets, hurdle clearance, stride-internal keys, story boundaries and loop continuity. The story duration and hurdle timing remain intact.

**Performance:** Materials/shader callbacks change once during load; no new frame-loop textures or material allocation. The cape deformation and cache identity compose with the roughness remap. Browser diagnostics on this Mac reported 144fps and 0.52ms CPU render submission cost in a sampled production window; these are device-specific observations, not a universal performance guarantee. Resolution adaptation remains enabled.

**Accessibility:** No new interactive control, hover dependency or DOM layout animation. System reduced-motion subscription, offscreen/hidden-tab suspension and cleanup remain intact. Actual offscreen playback held at 14.978s. This browser reported no reduced-motion preference; OS preference switching was not repeated in this change. Its source contract was inspected.

**Verdict: Approve — implementation and local review.** Independent source review found no unresolved structural finding. Root reviewed normal/quarter-speed browser playback, a complete stride frame sequence and held run/jump/coding/automation/acknowledgment poses. EN/HE mobile/desktop framing is intact, the head follows the lane/tasks and the shell/crown/cape have softer highlights. The actual stride preview is assembled from 21 held browser screenshots at 30ms pose intervals after the page entrance reaches full opacity; it is an inspection artifact, not a measured screen recording. Final visual acceptance remains with Itai.
