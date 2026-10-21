"""Import the delivered GLB into the saved studio, checking the real export.

Blender --background tools/robot-king/kohelet-robot-king.blend \
  --python tools/robot-king/verify_roundtrip.py
Writes front and back verification renders to /tmp; never saves the source.
"""
import bpy
import json
import struct
from pathlib import Path
from mathutils import Vector

base=Path(__file__).resolve().parents[2]
glb=base/'public/models/kohelet-robot-king.glb'
data=glb.read_bytes()
magic,version,length=struct.unpack_from('<III',data)
assert magic==0x46546c67 and version==2 and length==len(data)
chunk_length,chunk_type=struct.unpack_from('<II',data,12)
document=json.loads(data[20:20+chunk_length])
assert not document.get('textures')
expected=['Robot_Root','Body_Pivot','Head_Pivot','Arm_R_Pivot','Arm_L_Pivot']+['Data_Tile_'+str(i).zfill(2) for i in range(1,7)]
names={node.get('name') for node in document['nodes']}
assert all(name in names for name in expected)
triangles=sum(document['accessors'][primitive['indices']]['count']//3 for mesh in document['meshes'] for primitive in mesh['primitives'])
assert triangles < 80000 and len(data)<2_000_000
root=bpy.data.objects['Robot_Root']
for obj in reversed([root]+list(root.children_recursive)):
    bpy.data.objects.remove(obj,do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(glb))
assert all(bpy.data.objects.get(name) for name in expected)
scene=bpy.context.scene
scene.render.resolution_x=900
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.filepath='/tmp/robot-king-glb-roundtrip-front.png'
bpy.ops.render.render(write_still=True)
camera=scene.camera
camera.location=(-5.4,9.5,4.4)
camera.rotation_euler=(Vector((0,0,2.12))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath='/tmp/robot-king-glb-roundtrip-back.png'
bpy.ops.render.render(write_still=True)
print('GLB_ROUNDTRIP_OK',json.dumps({'bytes':len(data),'triangles':triangles,'meshes':len(document['meshes']),'materialPrimitives':sum(len(mesh['primitives']) for mesh in document['meshes']),'nodes':len(document['nodes']),'materials':len(document['materials']),'textures':len(document.get('textures',[]))}))
