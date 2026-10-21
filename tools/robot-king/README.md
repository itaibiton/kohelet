# Kohelet Robot King

Original custom Blender mesh sculpture following the user-approved Kohelet mascot reference, articulated for running in place. Geometry is modeled on every side, with a closed solid cape, compact segmented fists, faceted sapphire details, layered ceramic armor and physical emissive eye pixels. There are no external textures, stock models, paid generation calls or human facial features.

## Files

- `build_robot_king.py`: reproducible geometry, materials, export and studio render builder.
- `kohelet-robot-king.blend`: editable source with 231 individually named mesh parts, articulated animation pivots, studio lights and hero camera. The saved scene shows a sample running stride.
- `asset-metadata.json`: dimensions, orientation, exact neutral transforms, hierarchy, full-cycle running bounds, a 24-phase foot contact sweep and export statistics.
- `../../public/models/kohelet-robot-king.glb`: neutral browser delivery rig. Export merges rigid geometry within each pivot while preserving the editable source objects.
- `../../public/images/codex-landing/robot-king-running-poster.webp`: transparent 1280 × 1280 studio render of a running stride for loading and fallback states.

## Build

From the repository root, in a separate headless process:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python tools/robot-king/build_robot_king.py
```

This does not modify an open Blender scene. Tested with Blender 5.2.1 LTS. The builder reads current Principled shader nodes by node type, uses validated Blender properties, and exports glTF 2.0 without optional compression extensions.

## Runtime contract

- Blender faces −Y with Z up; glTF faces +Z with Y up. Feet sit at Y = 0 in the neutral glTF stance.
- Names: `Robot_Root`, `Body_Pivot`, `Head_Pivot`, `Arm_R_Pivot`, `Arm_L_Pivot`, `Cape_Pivot`, `Leg_R_Pivot`, `Leg_L_Pivot`, `Knee_R_Pivot`, `Knee_L_Pivot`, `Boot_R_Pivot`, `Boot_L_Pivot`, and `Data_Tile_01` through `Data_Tile_06`. There are 18 control nodes including `Robot_Root`.
- Each named pivot has one child mesh named `<pivot>__RigidGeometry`, except the root, which contains the hierarchy. Each knee is a child of its corresponding hip/leg pivot; each ankle/boot is a child of its knee. Cape and hips are children of the body.
- The exported GLB has a neutral leg stance and elbows bent 90 degrees with compact fists. No running offsets or animation clips are baked into the export. Preserve the saved neutral transforms and add runtime gait offsets.
- Local X is pitch, Y is yaw and Z is roll in glTF. Negative hip X swings the leg forward; positive knee X folds the heel backward/up. Both arms pump using shoulder X rotation, opposite the same-side hip.
- The reflective cobalt, ceramic and gold PBR materials need a neutral studio environment and a soft key light. Avoid overexposure, which washes out cobalt and gold.
- Cape materials deliberately omit the sheen lobe, which otherwise exports a white sheen color and washes royal blue into lavender in the browser. Ceramic, enamel and gold retain their authored PBR settings.
- Current asset: 46,940 triangles, 17 mesh objects, 64 material primitives, 35 total nodes, 13 materials and no textures. GLB is about 814 KiB.

Recommended orthographic camera in glTF coordinates: position `[5.4, 5.2, 9.5]`, target `[0.18, 2.12, 0]`, vertical span `5.5`. For narrow canvases, fit to the complete running bounds in `asset-metadata.json`; include the cape, both feet and all six tiles in the streaming trail.

The transparent poster is a render of this model, so fallback and canvas represent the same character. The illustrated approved reference remains a design reference only.

## Running cycle

The builder's studio pose and verifier use the same 0.82-second gait as the browser, sampled at phase π/2 for the poster. Hips alternate, knees bend on the backward swing, ankles counter-rotate, arms pump, the torso leans and bobs, the head counterbalances and the cape lifts. The body vertical offset is `0.033 + 0.09*cos(2*phase)` model units, including a 0.068-unit stance lift. This keeps the lowest sole above the ground throughout the sampled cycle while retaining a short airborne interval.

The `.blend` studio is intentionally posed; the GLB remains neutral for runtime articulation. Rebuilding always starts from a clean factory scene, exports neutral geometry, then applies the sample running pose solely to the saved studio and poster.

To validate the actual exported hierarchy and render two opposite running strides plus the rear view:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background tools/robot-king/kohelet-robot-king.blend --python tools/robot-king/verify_roundtrip.py
```

The verifier asserts glTF 2.0 integrity, required names, neutral joint rotations, knee/boot hierarchy, absent baked clips, absent cape sheen, no textures, and geometry/size budgets. It writes verification renders to `/tmp` without modifying the source.
