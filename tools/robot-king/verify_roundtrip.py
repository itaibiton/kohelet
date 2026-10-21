"""Import the delivered GLB into the saved studio, checking the real export.

Blender --background tools/robot-king/kohelet-robot-king.blend \
  --python tools/robot-king/verify_roundtrip.py
Writes front and back verification renders to /tmp; never saves the source.
"""
import bpy
import json
import math
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
assert len(document.get('images',[]))==4
assert len(document.get('textures',[]))==4
assert len(document['materials'])==3
assert all('bufferView' in image and image.get('mimeType')=='image/png' for image in document['images'])
binary_offset=20+chunk_length+8
for image in document['images']:
    view=document['bufferViews'][image['bufferView']]
    png=data[binary_offset+view.get('byteOffset',0):binary_offset+view.get('byteOffset',0)+view['byteLength']]
    assert png[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack_from('>II',png,16)==(128,128)
expected=['Robot_Root','Body_Pivot','Head_Pivot','Arm_R_Pivot','Arm_L_Pivot','Cape_Pivot']+[
    part+'_'+side+'_Pivot' for side in ['R','L'] for part in ['Leg','Knee','Boot']
]+['Data_Tile_'+str(i).zfill(2) for i in range(1,7)]
names={node.get('name') for node in document['nodes']}
assert all(name in names for name in expected)
assert not document.get('animations')
by_name={node['name']:node for node in document['nodes']}
for side in ['R','L']:
    for part in ['Leg','Knee','Boot']:
        assert by_name[part+'_'+side+'_Pivot'].get('rotation',[0,0,0,1])==[0,0,0,1]
    assert document['nodes'].index(by_name['Knee_'+side+'_Pivot']) in by_name['Leg_'+side+'_Pivot']['children']
    assert document['nodes'].index(by_name['Boot_'+side+'_Pivot']) in by_name['Knee_'+side+'_Pivot']['children']
for mat in document['materials']:
    assert not mat.get('doubleSided',False), 'Closed geometry should cull hidden backfaces'
    assert 'KHR_materials_sheen' not in mat.get('extensions',{})
    assert 'KHR_materials_clearcoat' not in mat.get('extensions',{})
    assert mat['pbrMetallicRoughness']['metallicFactor']<=.73
    if mat['name'].endswith('palette'):
        assert mat.get('normalTexture')
        assert mat['pbrMetallicRoughness'].get('metallicRoughnessTexture')
for mesh in document['meshes']:
    for primitive in mesh['primitives']:
        assert 'TEXCOORD_0' in primitive['attributes']
        color=document['accessors'][primitive['attributes']['COLOR_0']]
        assert color['componentType']==5121 and color['normalized'] and color['type']=='VEC4'
triangles=sum(document['accessors'][primitive['indices']]['count']//3 for mesh in document['meshes'] for primitive in mesh['primitives'])
assert triangles < 42000 and len(data)<1_700_000
assert sum(len(mesh['primitives']) for mesh in document['meshes'])<=35
root=bpy.data.objects['Robot_Root']
for obj in reversed([root]+list(root.children_recursive)):
    bpy.data.objects.remove(obj,do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(glb))
assert all(bpy.data.objects.get(name) for name in expected)
for name in expected:
    obj=bpy.data.objects[name]
    # glTF imports use quaternion rotation mode; convert before adding Euler
    # gait offsets, otherwise the assigned Euler values do not affect the mesh.
    rotation=obj.matrix_basis.to_euler('XYZ')
    obj.rotation_mode='XYZ'
    obj.rotation_euler=rotation
rest={name:(bpy.data.objects[name].location.copy(),bpy.data.objects[name].rotation_euler.copy()) for name in expected}
def sample_pose(phase):
    for name,(location,rotation) in rest.items():
        obj=bpy.data.objects[name]
        obj.location=location.copy()
        obj.rotation_euler=rotation.copy()
    stride=math.sin(phase)
    bpy.data.objects['Robot_Root'].rotation_euler.z=-.55
    for side,value in [('R',stride),('L',-stride)]:
        hip_x=-.72*value
        knee_x=.16+1.05*max(0,-value)**2
        bpy.data.objects['Leg_'+side+'_Pivot'].rotation_euler.x+=hip_x
        bpy.data.objects['Knee_'+side+'_Pivot'].rotation_euler.x+=knee_x
        bpy.data.objects['Boot_'+side+'_Pivot'].rotation_euler.x+=-.16-.72*hip_x-.38*knee_x
    bpy.data.objects['Arm_R_Pivot'].rotation_euler.x+=.64*stride
    bpy.data.objects['Arm_L_Pivot'].rotation_euler.x-=.64*stride
    body=bpy.data.objects['Body_Pivot']
    body.rotation_euler.x+=.16
    body.rotation_euler.z+=.045*stride
    body.rotation_euler.y-=.025*stride
    body.location.z+=.033+.09*math.cos(2*phase)
    bpy.data.objects['Head_Pivot'].rotation_euler.x+=-.09+.035*math.cos(2*phase)
    bpy.data.objects['Cape_Pivot'].rotation_euler.x+=.16+.08*math.sin(2*phase-.7)
    bpy.context.view_layer.update()
sample_pose(math.pi/2)
first_stride_boot=bpy.data.objects['Boot_R_Pivot'].matrix_world.translation.copy()
scene=bpy.context.scene
scene.render.resolution_x=900
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.filepath='/tmp/robot-king-glb-roundtrip-front.png'
bpy.ops.render.render(write_still=True)
sample_pose(3*math.pi/2)
opposite_stride_boot=bpy.data.objects['Boot_R_Pivot'].matrix_world.translation.copy()
assert (opposite_stride_boot-first_stride_boot).length>.25, 'Opposite stride must visibly move the articulated foot'
scene.render.filepath='/tmp/robot-king-glb-roundtrip-reverse-stride.png'
bpy.ops.render.render(write_still=True)
sample_pose(math.pi/2)
camera=scene.camera
camera.location=(-5.4,9.5,4.4)
camera.rotation_euler=(Vector((0,0,2.12))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath='/tmp/robot-king-glb-roundtrip-back.png'
bpy.ops.render.render(write_still=True)
print('GLB_ROUNDTRIP_OK',json.dumps({'bytes':len(data),'triangles':triangles,'meshes':len(document['meshes']),'materialPrimitives':sum(len(mesh['primitives']) for mesh in document['meshes']),'nodes':len(document['nodes']),'materials':len(document['materials']),'textures':len(document.get('textures',[]))}))
