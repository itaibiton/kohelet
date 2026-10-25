"""Render the current matte fallback without changing the source Blend or GLB.

Run in an isolated Blender process from the repository root:
  /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
    --python tools/robot-king/render_matte_poster.py

Writes the transparent 1280px WebP used by reduced-motion / WebGL fallbacks and
a PNG proof to the system temporary directory. No open Blender session is used.
"""
import json
import tempfile
from pathlib import Path

import bpy
from mathutils import Vector


BASE = Path(__file__).resolve().parents[2]
SOURCE = BASE / "tools/robot-king/kohelet-robot-king.blend"
OUTPUT = BASE / "public/images/codex-landing/robot-king-matte-poster.webp"
PROOF = Path(tempfile.gettempdir()) / "kohelet-robot-king-matte-poster.png"

bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene = bpy.context.scene


def matte_surface(material):
    """Match robot-materials.ts while retaining the editable studio texture nodes."""
    if not material.use_nodes:
        return
    shader = next((node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if shader is None:
        return
    name = material.name
    if name.startswith("Metal ·") or "brushed antique metal" in name:
        low, high, metallic, specular, normal = .72, .94, .32, .4, .5
    elif name.startswith("Cape ·"):
        low, high, metallic, specular, normal = .90, 1, 0, .12, .68
    elif name.startswith("Display ·") or "warm display pixels" in name:
        low, high, metallic, specular, normal = .92, 1, 0, .15, 0
        if shader.inputs["Emission Strength"].default_value > 0:
            shader.inputs["Emission Strength"].default_value = 1.25
    else:
        low, high, metallic, specular, normal = .84, .99, 0, .22, .58
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Specular IOR Level"].default_value = specular
    shader.inputs["Coat Weight"].default_value = 0
    shader.inputs["Sheen Weight"].default_value = 0
    shader.inputs["Transmission Weight"].default_value = 0
    roughness = shader.inputs["Roughness"]
    if roughness.is_linked:
        source = roughness.links[0].from_socket
        remap = material.node_tree.nodes.new("ShaderNodeMapRange")
        remap.name = "Matte finish · retain authored micrograin"
        remap.inputs["From Min"].default_value = 0
        remap.inputs["From Max"].default_value = 1
        remap.inputs["To Min"].default_value = low
        remap.inputs["To Max"].default_value = high
        material.node_tree.links.new(source, remap.inputs["Value"])
        material.node_tree.links.new(remap.outputs["Result"], roughness)
    else:
        roughness.default_value = low + (high - low) * roughness.default_value
    for node in material.node_tree.nodes:
        if node.type == "NORMAL_MAP":
            node.inputs["Strength"].default_value = normal


for material in bpy.data.materials:
    matte_surface(material)

# The saved source contains its earlier running pose. Preserve the readable
# stride, but remove the authored head's unrelated yaw/roll and harsh side view.
root = bpy.data.objects["Robot_Root"]
root.rotation_euler.z = -.12
bpy.data.objects["Head_Pivot"].rotation_euler = (-.16, 0, .01)
bpy.data.objects["Body_Pivot"].rotation_euler.y = -.012
bpy.data.objects["Body_Pivot"].rotation_euler.z = .035
bpy.data.objects["Torso_Pivot"].rotation_euler.z = -.055

# Broad, restrained studio sources replace the bright crown strip / blue rim.
lighting = {
    "Studio · large warm key": (470, 5.5, (1, .91, .78)),
    "Studio · soft front fill": (270, 5, (.87, .91, 1)),
    "Studio · blue rim": (180, 4.5, (.82, .88, 1)),
    "Studio · crown strip": (150, 4, (1, .92, .81)),
}
for name, (energy, size, color) in lighting.items():
    light = bpy.data.objects[name].data
    light.energy, light.size, light.color = energy, size, color
background = next(node for node in scene.world.node_tree.nodes if node.type == "BACKGROUND")
background.inputs["Color"].default_value = (.58, .59, .61, 1)
background.inputs["Strength"].default_value = .32
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = -.15

camera = scene.camera
camera.location = (5.1, -10, 4.8)
target = Vector((.1, 0, 2.12))
camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
camera.data.ortho_scale = 5.5
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = scene.render.resolution_y = 1280
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = str(PROOF)
bpy.context.view_layer.update()
bpy.ops.render.render(write_still=True)
scene.render.image_settings.file_format = "WEBP"
scene.render.image_settings.quality = 94
bpy.data.images["Render Result"].save_render(filepath=str(OUTPUT), scene=scene)
print("ROBOT_MATTE_POSTER", json.dumps({"webp": str(OUTPUT), "pngProof": str(PROOF),
    "width": 1280, "height": 1280, "webpBytes": OUTPUT.stat().st_size,
    "sourceSaved": False, "glbChanged": False}))
