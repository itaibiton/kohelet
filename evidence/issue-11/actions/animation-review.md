# Animation review

Applied official Emil Kowalski skills: `emil-design-eng`, `animate`, `review-animations` (official copies read from `/tmp/kohelet-codex-skills`). Purpose: explanatory marketing vignette showing practical coding and automation, with playful character motion. Existing UI interaction timings remain unchanged.

| Before | After | Why |
| --- | --- | --- |
| Explicit 30fps cap | Native display cadence with sustained-pressure adaptive DPR | Removes deliberate stepped playback and bounds resolution cost. |
| 64 glossy material primitives | 35 primitives, three shared matte/metal/LED materials, fine normal and roughness maps | Reduces draw overhead and gives the requested tactile finish. |
| One repeated stride | 14.4s run, jump, coding and automation story | Explains implementation work through the mascot. |
| Middle sprint drifted backward | Middle/final runs stay in place; automation beat recenters the scene | Preserves forward-running physicality and loop continuity. |
| Squash comment described the wrong origin | Comment matches `Body_Pivot` scaling | Workstation remains rigid while the body stretches slightly. |
| DPR floor could exceed a zoomed display ceiling | Floor is capped by the display ceiling | A quality downgrade cannot increase the resolution. |

Independent dense 2,880-pose camera sweep passes with all props. Maximum missed vertical extent is 0.02192 units versus 0.30522 units padding. Pause freezes the complete elapsed story, including task props. Lifecycle cleanup, abort handling, fallback and reduced-motion safeguards remain intact.

Verdict: **Approve**, supported by the root browser playback, keyboard, responsive and pixel checks in this directory. Performance measurements are local and do not establish hardware-wide guarantees.
