# Kohelet Robot King

Original custom Blender mesh sculpture following the user-approved Kohelet mascot reference, articulated for running, jumping and task choreography. Geometry is modeled on every side, with a closed solid cape, compact segmented fists, faceted sapphire details, layered sandstone armor and physical emissive eye pixels. The finish is warm matte sand ceramic, mineral cobalt and brushed antique gold. Four original 128px surface maps add real fine grain and brushed texture. There are no downloaded assets, stock models, paid generation calls or human facial features.

## Files

- `build_robot_king.py`: reproducible geometry, materials, export and studio render builder.
- `kohelet-robot-king.blend`: editable source with 231 individually named mesh parts, articulated animation pivots, studio lights and hero camera. The saved scene shows a sample running stride.
- `asset-metadata.json`: dimensions, orientation, exact neutral transforms, hierarchy, full-cycle running bounds, a 24-phase foot contact sweep and export statistics.
- `../../public/models/kohelet-robot-king.glb`: neutral browser delivery rig. Export merges rigid geometry within each pivot, consolidates its palette using byte vertex colors, and embeds the surface maps, while preserving the editable source objects.
- `../../public/images/codex-landing/robot-king-action-poster.webp`: transparent 1280 × 1280 studio render of a three-quarter running stride for loading and fallback states. The new filename invalidates the older shiny poster cache.

## Build

From the repository root, in a separate headless process:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python tools/robot-king/build_robot_king.py
```

This does not modify an open Blender scene. Tested with Blender 5.2.1 LTS. The builder reads current Principled shader nodes by node type, uses validated Blender properties, and exports glTF 2.0 without optional compression extensions. The export then packs float color attributes as standard normalized unsigned byte RGBA, and removes Blender's zero-weight clearcoat extension. This retains compatible standard glTF materials and saves about 250 KiB of vertex data.

## Runtime contract

- Blender faces −Y with Z up; glTF faces +Z with Y up. Feet sit at Y = 0 in the neutral glTF stance.
- Names: `Robot_Root`, `Body_Pivot`, `Head_Pivot`, `Arm_R_Pivot`, `Arm_L_Pivot`, `Cape_Pivot`, `Leg_R_Pivot`, `Leg_L_Pivot`, `Knee_R_Pivot`, `Knee_L_Pivot`, `Boot_R_Pivot`, `Boot_L_Pivot`, and `Data_Tile_01` through `Data_Tile_06`. There are 18 control nodes including `Robot_Root`.
- Each named pivot has one child mesh named `<pivot>__RigidGeometry`, except the root, which contains the hierarchy. Each knee is a child of its corresponding hip/leg pivot; each ankle/boot is a child of its knee. Cape and hips are children of the body.
- The exported GLB has a neutral leg stance and elbows bent 90 degrees with compact fists. No running offsets or animation clips are baked into the export. Preserve the saved neutral transforms and add runtime gait offsets.
- Local X is pitch, Y is yaw and Z is roll in glTF. Negative hip X swings the leg forward; positive knee X folds the heel backward/up. Both arms pump using shoulder X rotation, opposite the same-side hip.
- Keep each loaded material's base color white: the full original palette is carried by the `COLOR_0` vertex tint. Materials share embedded grain normal maps and roughness maps, sampled through physically consistent box UVs. Neutral studio light preserves the warm sandstone and rich cobalt.
- All delivery materials omit clearcoat and sheen, selecting the lighter standard PBR shader. Closed body and cape geometry use backface culling. Do not re-enable double-sided rendering or add clearcoat at runtime.
- Current asset: 39,676 triangles, 17 mesh objects, 35 material primitives, 35 total nodes, 3 materials and 4 embedded 128px texture images. GLB is about 1.45 MiB. Compared with the previous run-only model, primitives fall from 64 to 35 (45% fewer), and triangles fall 15.5%.

Recommended orthographic camera in glTF coordinates: position `[5.4, 5.2, 9.5]`, target `[0.18, 2.12, 0]`, vertical span `5.5`. The updated poster adds root yaw `-0.55` radians to show a stronger three-quarter side angle. Fit the browser camera to the complete runtime action sequence, including jump, task props, cape, feet and all six tiles; the metadata running bounds are only the builder's sample run cycle.

The transparent poster is a render of this model, so fallback and canvas represent the same character. The illustrated approved reference remains a design reference only.

## Browser action story

The browser uses a seamless 14.4-second story from `app/codex-landing/robot-run-cycle.ts`: a faster 0.6-second stride, an anticipated jump with a soft landing, a coding stop, another sprint, an automation gesture, then the opening run. Workstations are real, lightweight Three.js meshes in `robot-task-props.ts`; the screen texture is generated once. The camera measures the entire story and stays fixed. The quiet automation beat recenters the scene so the running legs never drift backward.

Playback follows native display cadence instead of the old 30fps cap. DPR starts at the lower of the display ratio and 1.25, and drops after sustained rendering pressure. Shader programs are warmed before the live canvas is revealed. Pause freezes the whole story, including props; reduced motion, offscreen and hidden-tab suspension remain supported.

For local QA, `?robot-debug=1` exposes measured cadence, CPU render submission time, draw calls and resolution as data attributes on `.kl-robot-canvas`. Adding `&robot-start=4.2` starts at the coding beat after a full reload; use `2.7` for the jump and `9.8` for automation. These parameters add no visible controls and do not affect normal visitors. Run the motion and actual exported-foot contact checks with `node --experimental-strip-types scripts/test-robot-choreography.ts`.

## Builder sample pose

The builder's studio pose and verifier use a representative running stride at phase π/2 for the poster. Hips alternate, knees bend on the backward swing, ankles counter-rotate, arms pump, the torso leans and bobs, the head counterbalances and the cape lifts. The reference body vertical offset is `0.033 + 0.09*cos(2*phase)` model units, including a 0.068-unit stance lift. The browser owns the pace, jump, task stops and complete choreography; none of those states are baked into the asset.

The `.blend` studio is intentionally posed; the GLB remains neutral for runtime articulation. Rebuilding always starts from a clean factory scene, exports neutral geometry, then applies the sample running pose solely to the saved studio and poster.

To validate the actual exported hierarchy and render two opposite running strides plus the rear view:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background tools/robot-king/kohelet-robot-king.blend --python tools/robot-king/verify_roundtrip.py
```

The verifier asserts glTF 2.0 integrity, required names, neutral joint rotations, knee/boot hierarchy, absent baked clips, no clearcoat/sheen, backface culling, four embedded textures, byte vertex tint, three materials, and geometry/size/draw budgets. It writes verification renders to `/tmp` without modifying the source.
