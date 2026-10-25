# Kohelet Robot King

Original custom Blender mesh sculpture following the user-approved Kohelet mascot reference, articulated for running, jumping and task choreography. Separate torso, elbow, wrist and facial controls allow weight shifts, upper-body counterrotation, typing, gestures, blinks and gaze. Geometry is modeled on every side, with a closed solid cape, compact segmented fists, faceted sapphire details, layered sandstone armor and physical emissive eye pixels. The finish is warm matte sand ceramic, mineral cobalt and brushed antique gold. Four original 128px surface maps add real fine grain and brushed texture. There are no downloaded assets, stock models, paid generation calls or human facial features.

## Files

- `build_robot_king.py`: reproducible geometry, materials, export and studio render builder.
- `kohelet-robot-king.blend`: editable source with individually named mesh parts, 28 articulated controls, studio lights and hero camera. The saved scene shows an expressive sprint stride.
- `asset-metadata.json`: dimensions, orientation, exact neutral transforms, hierarchy, full-cycle running bounds, a 24-phase foot contact sweep and export statistics.
- `../../public/models/kohelet-robot-king.glb`: neutral browser delivery rig. Export merges rigid geometry within each pivot, consolidates its palette using byte vertex colors, and embeds the surface maps, while preserving the editable source objects.
- `../../public/images/codex-landing/robot-king-performance-poster.webp`: transparent 1280 × 1280 studio render of a three-quarter sprint stride for loading and fallback states. The new filename invalidates the prior animation poster cache.

## Build

From the repository root, in a separate headless process:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python tools/robot-king/build_robot_king.py
```

This does not modify an open Blender scene. Tested with Blender 5.2.1 LTS. The builder reads current Principled shader nodes by node type, uses validated Blender properties, and exports glTF 2.0 without optional compression extensions. The export then packs float color attributes as standard normalized unsigned byte RGBA, and removes Blender's zero-weight clearcoat extension. This retains compatible standard glTF materials and saves about 250 KiB of vertex data.

## Runtime contract

- Blender faces −Y with Z up; glTF faces +Z with Y up. Feet sit at Y = 0 in the neutral glTF stance.
- Names: `Robot_Root`, `Body_Pivot`, `Torso_Pivot`, `Head_Pivot`, `Arm_R/L_Pivot`, `Elbow_R/L_Pivot`, `Wrist_R/L_Pivot`, `Cape_Pivot`, `Leg_R/L_Pivot`, `Knee_R/L_Pivot`, `Boot_R/L_Pivot`, `Eye_R/L_Pivot`, `Brow_R/L_Pivot`, `Smile_Pivot`, and `Data_Tile_01` through `Data_Tile_06`. There are 28 control nodes including `Robot_Root`.
- Each named pivot has one child mesh named `<pivot>__RigidGeometry`, except the root, which contains the hierarchy. All 27 mesh children have identity transforms: vertex coordinates are relative to the articulation hinge. Each knee is a child of its corresponding hip; each boot is a child of its knee. Hips remain under `Body_Pivot`. Upper chest, shoulders, head and cape follow `Torso_Pivot`. Each forearm follows its elbow and each hand follows its wrist.
- The exported GLB has a neutral leg stance and elbows bent 90 degrees with compact fists. No running offsets or animation clips are baked into the export. Preserve the saved neutral transforms and add runtime gait offsets.
- Local X is pitch, Y is yaw and Z is roll in glTF. Negative hip X swings the leg forward; positive knee X folds the heel backward/up. Both arms pump using shoulder X rotation, opposite the same-side hip.
- Elbow and wrist controls are neutral identity rotations; the geometry retains the prior 90-degree elbow bend. Add delta rotations. Negative elbow X raises the forearm and positive X lowers it. Neutral eyes are both open. Scale eye Y for blinks, translate X/Y for gaze, rotate brow Z for expression, translate brow Y for lift, and scale smile X/Y for expression. Keep changes small enough to remain on the visor.
- Keep each loaded material's base color white: the full original palette is carried by the `COLOR_0` vertex tint. Materials share embedded grain normal maps and roughness maps, sampled through physically consistent box UVs. Neutral studio light preserves the warm sandstone and rich cobalt.
- All delivery materials omit clearcoat and sheen, selecting the lighter standard PBR shader. Closed body and cape geometry use backface culling. Do not re-enable double-sided rendering or add clearcoat at runtime.
- Current asset: 40,892 triangles, 27 mesh objects, 49 material primitives, 55 total nodes, 3 materials and 4 embedded 128px texture images. GLB is about 1.53 MiB. The extra articulated groups preserve the original matte material family, single-sided rendering and byte vertex palette; the richer rig stays below 55 draws, 50,000 triangles and 2 MB.

New neutral control positions in glTF, relative to the named parent:

| Control | Parent | Local translation | Purpose |
| --- | --- | --- | --- |
| `Torso_Pivot` | `Body_Pivot` | `[0, -0.18, 0]` | Twist/lean upper body independently of hips |
| `Elbow_R/L_Pivot` | matching shoulder | `[±0.16, -0.36, -0.01]` | Fold forearms |
| `Wrist_R/L_Pivot` | matching elbow | `[0, 0, 0.37]` | Type, aim and gesture with hands |
| `Eye_R/L_Pivot` | `Head_Pivot` | `[±0.40, 0.16, 0.772]` | Blink and shift digital gaze |
| `Brow_R/L_Pivot` | `Head_Pivot` | `[±0.40, 0.375, 0.778]` | Focus, surprise and friendly expression |
| `Smile_Pivot` | `Head_Pivot` | `[0, -0.38, 0.655]` | Change smile width and height |

`R` controls use negative X, and `L` controls positive X. The exact transforms and hierarchy are recorded in `asset-metadata.json`.

Recommended orthographic camera in glTF coordinates: position `[5.4, 5.2, 9.5]`, target `[0.18, 2.12, 0]`, vertical span `5.5`. The updated poster adds root yaw `-0.62` radians and torso counterrotation to show a stronger three-quarter side angle. Fit the browser camera to the complete runtime action sequence, including jump, task props, cape, feet and all six tiles; the metadata running bounds are only the builder's sample run cycle.

For cape deformation, `Cape_Pivot__RigidGeometry` combines fabric and trim at the same coordinates with identity child transform. Its local clasp hinge is `[0,0,0]`; the lower hem extends down negative Y to about `-1.77`, width is X, and aft is negative Z. Local bounds are approximately `[-2.076,-1.771,-0.842]` to `[1.331,0.090,0.400]`. Pin the top near `Y=0` and increase displacement toward the hem, applying the same formula to both material primitives so trim follows the cloth.

The transparent poster is a render of this model, so fallback and canvas represent the same character. The illustrated approved reference remains a design reference only.

## Browser action story

The browser uses a seamless 20.16-second performance from `app/codex-landing/robot-run-cycle.ts`: a 0.48-second sprint stride, banking turn, anticipation and ballistic jump, tucked flight, knee absorption on landing, braking, articulated typing, deliberate Enter press, workflow grab/drag/activation, acknowledgment and acceleration back into the sprint. Leg targets are solved with two-bone IK and the actual boot support hull; arm targets use shoulder/elbow/wrist IK. Running implies a moving ground, while task foot targets hold in model-root space. Root translation and body lift use authored model units directly; no height-based rescaling is applied to the IK results.

`robot-secondary-motion.ts` adds bounded GPU cloth movement to both cape fabric and trim, including the inverse-transpose normal correction and padded culling bounds. Five instanced ground streaks taper at their reset; a brief ring/dust cue starts at actual touchdown. Physical eye, brow and smile controls use continuous expression weights and timed blinks. All secondary motion uses the paused story clock.

Workstations in `robot-task-props.ts` have a hinged laptop, progressively typed code, and workflow nodes/wires that follow hand actions. The activated node responds before packets travel, and completion follows the packet result. Code uploads are bucketed; geometry is built once. The fixed camera measures all character, prop and instanced-effect poses across the full story.

Playback follows native display cadence instead of the old 30fps cap. DPR starts at the lower of the display ratio and 1.25, and drops after sustained rendering pressure. Shader programs are warmed before the live canvas is revealed. Pause freezes the whole story, including props; reduced motion, offscreen and hidden-tab suspension remain supported.

For local QA, `?robot-debug=1` exposes measured cadence, CPU render submission time, draw calls, pose time and resolution as data attributes on `.kl-robot-canvas`. Add `&robot-start=7` for typing, `4.05` for the jump, `11.8` for workflow dragging or `14.5` for acknowledgment. `&robot-rate=0.25` slows playback for feel checks. Fully reload after changing these parameters. They add no visible controls and do not affect normal visitors. Run the motion, actual exported-foot contact, hand reach, causal timing and dense quaternion checks with `node --experimental-strip-types scripts/test-robot-choreography.ts`.

## Builder sample pose

The builder's studio pose and verifier use a representative running stride at phase π/2 for the poster. Hips alternate, knees bend on the backward swing, ankles counter-rotate, arms pump, the torso leans and bobs, the head counterbalances and the cape lifts. The reference body vertical offset is `0.033 + 0.09*cos(2*phase)` model units, including a 0.068-unit stance lift. The browser owns the pace, jump, task stops and complete choreography; none of those states are baked into the asset.

The `.blend` studio is intentionally posed; the GLB remains neutral for runtime articulation. Rebuilding always starts from a clean factory scene, exports neutral geometry, then applies the sample running pose solely to the saved studio and poster.

To validate the actual exported hierarchy and render two opposite running strides plus the rear view:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background tools/robot-king/kohelet-robot-king.blend --python tools/robot-king/verify_roundtrip.py
```

The verifier asserts glTF 2.0 integrity, all 28 names, neutral joint rotations, torso/elbow/wrist/face/leg hierarchy, identity mesh transforms, actual independent elbow and wrist geometry movement, absent baked clips, no clearcoat/sheen, backface culling, four embedded textures, byte vertex tint, three materials, and geometry/size/draw budgets. It writes sprint, reverse-stride, rear and expressive task-pose verification renders to `/tmp` without modifying the source.
