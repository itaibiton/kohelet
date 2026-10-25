# Robot King animation review

Reviewed implementation: `238e1be` — the 20.16-second articulated character performance.

Review basis: Emil Kowalski’s official `emil-design-eng`, `animate`, and `review-animations` skills, including the review standards. This review covers character motion, supporting effects, rendering lifecycle, and framing.

| Before | After | Why |
| --- | --- | --- |
| Repeated opposing joint oscillations and small shoulder taps | Authored contact/swing targets, leg IK, torso counter-rotation, independent elbows/wrists, and hand targets | Running and task work have distinct mechanics and readable poses. |
| Activation compressed node 2 while the pressing hand reached node 0 | Node 0 compresses and highlights beneath the hand | The visible response follows the actual gesture; packets advance after activation. |
| Workflow wires used planar rotation | Wires align with the full three-dimensional endpoint vector | Connections reach the nodes throughout assembly and dragging. |
| Ground impact began before touchdown | Impact begins at 4.55 seconds | Contact cues follow the landing. |
| Swing-leg extension approached a locked-knee singularity | Soft reach limit for the swing leg, preserving support contact | Reduces knee snapping while keeping planted feet grounded. |
| Cape lighting approximated one wave; deformation needed explicit bounds | Both waves use the inverse-transpose normal derivative; geometry bounds include 0.18 units of displacement | Lighting follows the bounded cloth warp, and camera/culling calculations include its extent. |
| Expression enums and wrapping streaks could produce visible resets | Continuous facial weights and tapered streak endpoints | Acting and speed cues remain continuous. |
| Framing needed to include the richer rig and supporting geometry | 360-pose envelope includes facial controls, workstation geometry, cape bounds, and instanced ground bounds | The full performance fits a fixed camera without per-frame reframing. |

## Verification reviewed

- Independent dense framing sweep: **7,200 poses**, **22 animated controls**, and **five facial controls**. Maximum missed extent compared with the 360-pose envelope is **0.00262 X / 0.00214 Y** model units; available padding is **0.3132 X / 0.3268 Y** per side.
- Final reported geometry checks: **2,017 poses**, minimum floor clearance **0.00200019** units, and maximum support-contact error **0.00000534** units. Physical rotation checks sampled **4,839 poses**, with maximum adjacent rotation step **0.1468 radians** after the soft-reach correction.
- Cape displacement remains below **0.18 units** for tested effect weights in `[0,1]`. Its normal-transform denominator stays above **0.7816**. Cape harmonics and ground streak phases repeat at the story seam.
- Source review found no remaining blocking shader, disposal, cancellation, pause/resume, reduced-motion, offscreen, or hidden-tab regression. Shared resources are deduplicated for disposal, and instanced meshes release their instance resources.
- The root’s optimized production-browser QA reported clean shader compilation, visible articulated task interactions, no browser errors, and **143.9fps** with **0.37ms** CPU submission/update cost on the tested desktop setup. CPU timing is not GPU timing or a hardware-wide performance guarantee.

## Limits

- Running uses an implied moving ground and limited stage travel; it is a treadmill-style performance rather than continuous forward travel through a world.
- Physical mobile hardware was not tested. Responsive browser inspection does not establish performance on a phone.
- The repository’s existing full ESLint configuration failure remains outside this animation change. Focused checks supplement it; they do not replace a passing repository-wide lint run.

## Verdict

**Approve `238e1be`.** No remaining blocking source or motion finding. The richer choreography, contact mechanics, causal task responses, bounded secondary motion, and fixed framing address the issues identified in review. Visual feel and performance claims remain limited to the production-browser setup actually inspected.
