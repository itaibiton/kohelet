# Kohelet Robot King

Original custom Blender mesh sculpture following the user-approved Kohelet mascot reference. Geometry is modeled on every side, with a closed solid cape, individually segmented hands, faceted sapphire details, layered ceramic armor and physical emissive eye pixels. There are no external textures, stock models, paid generation calls or human facial features.

## Files

- `build_robot_king.py`: reproducible geometry, materials, export and studio render builder.
- `kohelet-robot-king.blend`: editable source with 221 individually named mesh parts, named animation pivots, studio lights and hero camera.
- `asset-metadata.json`: dimensions, orientation, camera and export statistics.
- `../../public/models/kohelet-robot-king.glb`: browser delivery asset. Export merges rigid geometry within each pivot while preserving the editable source objects.
- `../../public/images/codex-landing/robot-king-3d-poster.webp`: transparent 1280 × 1280 studio render of this model for loading and fallback states.

## Build

From the repository root, in a separate headless process:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python tools/robot-king/build_robot_king.py
```

This does not modify an open Blender scene. Tested with Blender 5.2.1 LTS. The builder reads current Principled shader nodes by node type, uses validated Blender properties, and exports glTF 2.0 without optional compression extensions.

## Runtime contract

- Blender faces −Y with Z up; glTF faces +Z with Y up. Feet sit at Y = 0 in glTF.
- Names: `Robot_Root`, `Body_Pivot`, `Head_Pivot`, `Arm_R_Pivot`, `Arm_L_Pivot`, and `Data_Tile_01` through `Data_Tile_06`.
- Each named pivot has one child mesh named `<pivot>__RigidGeometry`, except the root, which contains the hierarchy.
- Preserve authored rotations and add small idle offsets to each pivot's initial transform. No animations are baked into the GLB.
- The left arm is the raised palm. The right hand rests on the hip.
- The reflective cobalt, ceramic and gold PBR materials need a neutral studio environment and a soft key light. Avoid overexposure, which washes out cobalt and gold.
- Cape materials deliberately omit the sheen lobe, which otherwise exports a white sheen color and washes royal blue into lavender in the browser. Ceramic, enamel and gold retain their authored PBR settings.
- Current asset: 45,192 triangles, 10 mesh objects, 42 material primitives, 21 nodes, 13 materials and no textures. GLB is about 821 KiB.

Recommended orthographic camera in glTF coordinates: position `[5.4, 5.2, 9.5]`, target `[0.18, 2.12, 0]`, vertical span `5.3`. For narrow canvases, fit to the complete bounds in `asset-metadata.json`; include both the cape and the upper floating tiles.

The transparent poster is a render of this model, so fallback and canvas represent the same character. The illustrated approved reference remains a design reference only.
