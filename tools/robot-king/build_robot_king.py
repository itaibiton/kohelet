"""Build Kohelet's original, editable Robot King from mesh geometry.

Run with Blender 5.2+ in an isolated process:
  Blender --background --factory-startup --python tools/robot-king/build_robot_king.py

No scene assets, external textures, generation services, or open Blender files are used.
Model faces -Y in Blender; feet sit at Z=0. The glTF exporter converts Z up to Y up.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

BASE = Path(__file__).resolve().parents[2]
OUT = BASE / "public/models/kohelet-robot-king.glb"
SOURCE = Path(__file__).resolve().parent / "kohelet-robot-king.blend"
PREVIEW = Path(__file__).resolve().parent / "preview.png"
POSTER = BASE / "public/images/codex-landing/robot-king-3d-poster.webp"

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic=0, roughness=.3, coat=.0, emission=0, sheen=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = next(node for node in mat.node_tree.nodes if node.type == 'BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value = (*color, 1)
    node.inputs['Metallic'].default_value = metallic
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Coat Weight'].default_value = coat
    node.inputs['Coat Roughness'].default_value = .18
    node.inputs['Sheen Weight'].default_value = sheen
    if emission:
        node.inputs['Emission Color'].default_value = (*color, 1)
        node.inputs['Emission Strength'].default_value = emission
    mat.diffuse_color = (*color, 1)
    return mat

ivory = material('Ceramic · warm ivory', (.80,.69,.49), .08,.29,.28)
ivory_light = material('Ceramic · porcelain edge', (.91,.82,.64), .05,.26,.25)
gold = material('Metal · brushed royal gold', (.66,.35,.08), .79,.25,.25)
gold_light = material('Metal · champagne bevel', (.86,.55,.17), .7,.23,.25)
chrome = material('Metal · polished titanium', (.43,.48,.55), .92,.19,.3)
joint = material('Joint · dark graphite', (.022,.03,.052), .65,.26)
cobalt = material('Enamel · Kohelet cobalt', (.008,.035,.57), .32,.22,.32)
sapphire = material('Gem · sapphire blue', (.008,.027,.36), .45,.12,.8)
visor = material('Visor · midnight blue glass', (.004,.011,.065), .48,.12,.8)
visor_edge = material('Visor · blue chrome edge', (.026,.055,.38), .75,.15,.7)
# White Principled sheen exports as a pale glTF sheen lobe under browser studio
# environments. Keep these two cloth materials sheen-free to retain royal blue.
cape_mat = material('Cape · royal cobalt fabric', (.016,.035,.39), .02,.48,.05)
cape_lining = material('Cape · satin inner blue', (.018,.06,.55), .05,.4,.1)
led = material('Display · warm ivory LEDs', (1,.72,.24), .15,.24,emission=3)
led_dim = material('Display · dark pixel substrate', (.018,.035,.15), .2,.26)

def parent_keep_world(obj, parent):
    if parent:
        bpy.context.view_layer.update()
        world = obj.matrix_world.copy()
        obj.parent = parent
        obj.matrix_world = world
    return obj

def empty(name, loc=(0,0,0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.empty_display_type = 'PLAIN_AXES'
    obj.empty_display_size = .15
    return parent_keep_world(obj, parent)

root = empty('Robot_Root')
body_pivot = empty('Body_Pivot', (0,0,1.56), root)
head_pivot = empty('Head_Pivot', (0,0,2.82), body_pivot)
arm_r = empty('Arm_R_Pivot', (-.65,0,1.85), body_pivot)
arm_l = empty('Arm_L_Pivot', (.65,0,1.85), body_pivot)

def finish(obj, name, mat, parent, bevel=0, segments=3):
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Manufactured soft edge', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'ANGLE'
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = True
        mod = obj.modifiers.new('Armor weighted normals', 'WEIGHTED_NORMAL')
        mod.keep_sharp = True
        mod.weight = 30
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return parent_keep_world(obj, parent)

def box(name, loc, dims, mat, parent=body_pivot, bevel=.06, rotation=None, segments=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish(obj, name, mat, parent, bevel, segments)
    if rotation:
        obj.rotation_euler = rotation
    return obj

def sphere(name, loc, scale, mat, parent=body_pivot, segments=20, rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=loc)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent)

def cylinder(name, a, b, radius, mat, parent=body_pivot, vertices=24, bevel=.012):
    a,b = Vector(a),Vector(b)
    delta = b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=delta.length, location=(a+b)/2)
    obj = bpy.context.object
    obj.rotation_euler = delta.to_track_quat('Z', 'Y').to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent, bevel, 2)

def tube(name, coords, radius, mat, parent=body_pivot, resolution=8):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = resolution
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(coords)-1)
    for point, coordinate in zip(spline.bezier_points, coords):
        point.co = coordinate
        point.handle_left_type = point.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    curve.materials.append(mat)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target='MESH')
    obj.select_set(False)
    return parent_keep_world(obj,parent)

def profile(name, xz, front_y, back_y, mat, parent=body_pivot, bevel=.03):
    n=len(xz)
    verts=[(x,front_y,z) for x,z in xz]+[(x,back_y,z) for x,z in xz]
    faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]
    faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(obj)
    return finish(obj,name,mat,parent,bevel,3)

def gem(name, loc, dims, parent):
    # Closed, faceted sapphire: stepped girdle, inset table, triangular crown facets.
    x,y,z=loc
    w,d,h=dims
    corners=[(-1,-1),(1,-1),(1,1),(-1,1)]
    verts=[(x+a*w*.5,y+d*.35,z+b*h*.5) for a,b in corners]
    verts += [(x+a*w*.5,y-d*.12,z+b*h*.5) for a,b in corners]
    verts += [(x+a*w*.32,y-d*.5,z+b*h*.32) for a,b in corners]
    faces=[(3,2,1,0)]
    for i in range(4):
        j=(i+1)%4
        faces += [(i,j,4+j,4+i),(4+i,4+j,8+j),(4+i,8+j,8+i)]
    faces.append((8,9,10,11))
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces)
    obj=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(obj)
    mesh.materials.append(sapphire)
    return parent_keep_world(obj,parent)

# Oversized, softly machined ceramic head with a recessed blue face bezel.
profile('Head · tapered ceramic shell',[(-.99,3.58),(.99,3.58),(.99,2.39),(.66,2.12),(-.66,2.12),(-.99,2.39)],-.61,.61,ivory,head_pivot,.16)
box('Face · polished gold gasket',(0,-.586,2.96),(1.78,.13,.87),gold_light,head_pivot,.19,segments=5)
box('Face · cobalt gasket',(0,-.655,2.96),(1.72,.13,.81),visor_edge,head_pivot,.18,segments=5)
box('Face · midnight glass',(0,-.710,2.96),(1.64,.10,.73),visor,head_pivot,.17,segments=5)
for side in [-1,1]:
    cylinder('Ear · gold housing '+str(side),(side*.91,.015,2.86),(side*1.035,.015,2.86),.265,gold,head_pivot,32)
    cylinder('Ear · cobalt speaker '+str(side),(side*1.027,.015,2.86),(side*1.085,.015,2.86),.215,cobalt,head_pivot,32)
    cylinder('Ear · inner sapphire '+str(side),(side*1.079,.015,2.86),(side*1.097,.015,2.86),.14,sapphire,head_pivot,24)
    for offset in [-.06,0,.06]:
        box('Ear · vent '+str(side)+' '+str(offset),(side*1.102,.015+offset,2.86),(.01,.019,.13),joint,head_pivot,.007,segments=2)

# A warm dot-matrix wink, made from emissive physical pixels rather than a decal.
def pixels(name, center, pattern):
    spacing=.039
    for row,line in enumerate(pattern):
        for col,cell in enumerate(line):
            if cell=='1':
                box(name+' '+str(row)+'-'+str(col),(center[0]+(col-(len(line)-1)/2)*spacing,-.772,center[1]-(row-(len(pattern)-1)/2)*spacing),(.031,.018,.031),led,head_pivot,.004,segments=1)
pixels('Eye · friendly wink',(-.40,2.98),['000000000','000000000','111111110','111111110','000011110','000011100','000001000'])
pixels('Eye · open sapphire display',(.40,2.98),['011110','111111','110011','110011','110011','110011','111111','011110'])
tube('Smile · warm gold arc',[(-.16,-.624,2.475),(-.09,-.648,2.44),(0,-.655,2.43),(.09,-.648,2.44),(.16,-.624,2.475)],.015,led,head_pivot,8)
box('Chin · champagne frame',(0,-.595,2.20),(.32,.15,.32),gold_light,head_pivot,.045,segments=3)
box('Chin · brushed gold plate',(0,-.684,2.22),(.24,.045,.245),gold,head_pivot,.025,segments=3)
for x in [-.74,.74]:
    box('Cheek · subtle cheek accent '+str(x),(x,-.535,2.40),(.17,.10,.05),ivory_light,head_pivot,.02)

# Sculpted crown with gold silhouette, ivory enamel faces and a faceted sapphire.
crown_shape=[(-.98,3.46),(-1.04,3.80),(-.83,3.94),(-.61,3.75),(-.44,3.78),(-.40,4.14),(-.17,4.20),(.04,4.18),(.08,3.78),(.28,3.78),(.35,4.04),(.56,4.04),(.64,3.76),(.83,3.89),(1.00,3.81),(.96,3.46)]
profile('Crown · gold sculpted silhouette',crown_shape,-.51,-.31,gold_light,head_pivot,.035)
inner=[(x*.94,3.50+(z-3.50)*.92) for x,z in crown_shape]
profile('Crown · ivory enamel inlay',inner,-.551,-.51,ivory_light,head_pivot,.026)
box('Crown · sapphire gold setting',(-.18,-.595,3.91),(.265,.10,.36),gold,head_pivot,.035)
gem('Crown · cut sapphire',(-.18,-.66,3.91),(.20,.075,.29),head_pivot)
for side in [-1,1]:
    profile('Crown · side enamel '+str(side),[(side*.76,3.45),(side*.99,3.47),(side*1.00,3.80),(side*.87,3.88)],-.28,.40,gold,head_pivot,.025)
    box('Crown · rear band '+str(side),(side*.53,.43,3.56),(.88,.15,.24),ivory,head_pivot,.045)
    box('Crown · side accent '+str(side),(side*.99,.09,3.60),(.05,.55,.10),ivory_light,head_pivot,.02)

# Torso: tapered shell with inlaid borders, chest gem, belly plate and side vents.
cylinder('Neck · chrome swivel',(0,0,1.98),(0,0,2.16),.24,chrome,body_pivot,28)
cylinder('Neck · cobalt collar',(0,0,2.02),(0,0,2.12),.285,cobalt,body_pivot,28)
chest=[(-.62,1.96),(.62,1.96),(.56,1.55),(.36,1.18),(-.36,1.18),(-.56,1.55)]
profile('Body · outer gold seam',chest,-.43,.34,gold,body_pivot,.13)
profile('Body · ivory chest shell',[(x*.95,1.6+(z-1.6)*.95) for x,z in chest],-.467,.31,ivory,body_pivot,.12)
box('Body · sapphire chest frame',(0,-.523,1.72),(.30,.12,.32),gold_light,body_pivot,.055)
gem('Body · faceted sapphire chest',(0,-.608,1.73),(.22,.08,.24),body_pivot)
profile('Body · lower abdomen shield',[(-.27,1.46),(.27,1.46),(.21,1.16),(-.21,1.16)],-.57,-.44,ivory_light,body_pivot,.075)
box('Body · back service hatch',(0,.354,1.65),(.62,.055,.42),cobalt,body_pivot,.08)
for side in [-1,1]:
    for z in [1.51,1.60,1.69]:
        box('Body · side vent '+str(side)+' '+str(z),(side*.54,.025,z),(.035,.32,.038),joint,body_pivot,.01,rotation=(0,side*.15,0))

# Chrome hip ball joints and oversized cobalt boots with layered gold soles.
for side in [-1,1]:
    x=side*.37
    sphere('Hip · swivel '+str(side),(x,0,1.12),(.20,.20,.20),chrome)
    cylinder('Leg · thigh dark core '+str(side),(x,0,1.08),(side*.42,-.02,.71),.135,joint)
    cylinder('Leg · ivory upper armor '+str(side),(x,0,1.04),(side*.42,-.02,.77),.175,ivory,vertices=24,bevel=.035)
    sphere('Knee · titanium joint '+str(side),(side*.42,-.01,.65),(.15,.16,.15),chrome)
    box('Boot · raised cobalt cuff '+str(side),(side*.43,-.02,.53),(.46,.50,.45),cobalt,bevel=.10,rotation=(0,side*.07,0),segments=4)
    box('Boot · gold sole '+str(side),(side*.43,-.19,.085),(.66,.96,.14),gold_light,bevel=.065,segments=4)
    box('Boot · black outsole '+str(side),(side*.43,-.19,.035),(.62,.91,.07),joint,bevel=.032,segments=3)
    box('Boot · rounded cobalt toe '+str(side),(side*.43,-.24,.27),(.63,.88,.43),cobalt,bevel=.19,segments=5)
    tube('Boot · ivory toe seam '+str(side),[(side*.43-.26,-.58,.21),(side*.43,-.65,.23),(side*.43+.26,-.58,.21)],.012,ivory_light)
    cylinder('Boot · ankle gold disk '+str(side),(side*.65,0,.47),(side*.71,0,.47),.125,gold_light,vertices=24)
    cylinder('Boot · ankle inset '+str(side),(side*.708,0,.47),(side*.725,0,.47),.092,ivory,vertices=24)

# Each arm is a real hierarchy with machined sleeves, joint rings and fingers.
def limb(prefix, a, b, radius, parent):
    cylinder(prefix+' · titanium core',a,b,radius*.74,chrome,parent)
    a,b=Vector(a),Vector(b)
    cylinder(prefix+' · ivory sleeve',a.lerp(b,.16),a.lerp(b,.84),radius,ivory,parent,24,.035)
    cylinder(prefix+' · gold seam',a.lerp(b,.80),a.lerp(b,.85),radius*1.02,gold_light,parent,24,.008)

for side,parent in [(-1,arm_r),(1,arm_l)]:
    shoulder=(side*.67,0,1.86)
    sphere('Shoulder · chrome swivel '+str(side),shoulder,(.20,.20,.20),chrome,parent)
    cylinder('Shoulder · sapphire socket '+str(side),(side*.56,0,1.86),(side*.72,0,1.86),.22,cobalt,parent,28)
    if side==-1:
        elbow=(-.99,-.03,1.52)
        wrist=(-.79,-.36,1.28)
    else:
        elbow=(1.00,-.02,1.54)
        wrist=(1.29,-.19,1.93)
    limb('Arm '+str(side)+' upper',shoulder,elbow,.17,parent)
    sphere('Elbow · titanium ball '+str(side),elbow,(.155,.155,.155),chrome,parent)
    limb('Arm '+str(side)+' lower',elbow,wrist,.195,parent)
    sphere('Wrist · titanium ball '+str(side),wrist,(.12,.12,.12),chrome,parent)

# Left hand: open palm with four individually segmented, gently curling fingers.
box('Palm_L · ceramic shell',(1.43,-.32,2.015),(.43,.39,.21),ivory_light,arm_l,.09,segments=4)
box('Palm_L · blue energy inset',(1.44,-.31,2.13),(.16,.19,.025),cobalt,arm_l,.045)
for i in range(4):
    x=1.25+i*.12
    length=1-(abs(i-1.5)*.07)
    points=[(x,-.43,2.04),(x,-.54,2.08),(x,-.65*length,2.17),(x,-.67*length,2.28)]
    for j,(a,b) in enumerate(zip(points,points[1:])):
        sphere('Finger_L '+str(i)+' joint '+str(j),a,(.052,.052,.052),chrome,arm_l,12,8)
        cylinder('Finger_L '+str(i)+' segment '+str(j),a,b,.053,ivory_light,arm_l,12,.018)
    sphere('Finger_L '+str(i)+' rounded tip',points[-1],(.053,.053,.063),ivory_light,arm_l,12,8)
thumb=[(1.21,-.27,2.00),(1.07,-.39,2.06),(1.02,-.52,2.17)]
for j,(a,b) in enumerate(zip(thumb,thumb[1:])):
    sphere('Thumb_L joint '+str(j),a,(.067,.067,.067),chrome,arm_l,12,8)
    cylinder('Thumb_L segment '+str(j),a,b,.069,ivory,arm_l,14,.022)
sphere('Thumb_L ceramic tip',thumb[-1],(.072,.065,.078),ivory_light,arm_l,14,8)

# Right hand rests confidently on the hip; separate knuckles preserve silhouette.
box('Palm_R · ceramic shell',(-.66,-.48,1.25),(.32,.24,.30),ivory_light,arm_r,.075,rotation=(0,.25,-.3))
for i in range(4):
    x=-.79+i*.09
    a=(x,-.55,1.26)
    b=(x+.025,-.65,1.16)
    c=(x+.055,-.61,1.09)
    for j,(p,q) in enumerate([(a,b),(b,c)]):
        sphere('Finger_R joint '+str(i)+' '+str(j),p,(.044,.044,.044),chrome,arm_r,12,8)
        cylinder('Finger_R segment '+str(i)+' '+str(j),p,q,.047,ivory,arm_r,12,.017)
sphere('Thumb_R joint',(-.47,-.47,1.31),(.06,.06,.06),chrome,arm_r,12,8)
cylinder('Thumb_R armor',(-.47,-.47,1.31),(-.43,-.59,1.24),.06,ivory,arm_r,14,.02)

# Real double-sided closed cape mesh, softly folded and asymmetric at the hem.
nu,nv=28,18
verts=[]
for j in range(nv+1):
    v=j/nv
    for i in range(nu+1):
        u=-1+2*i/nu
        x=u*(.59+v*1.08)-.36*v**1.3+.12*math.sin(u*math.pi)*math.sin(v*math.pi)-.28*(1-u)*math.sin(v*math.pi)
        y=.29+.52*math.sin(v*math.pi/2)+.30*math.cos(u*3*math.pi)*v+.17*(1-u*u)*math.sin(v*math.pi)-.60*abs(u)**4*v
        z=2.01-v*1.48+.20*math.cos(u*3*math.pi)*v**3-.07*u
        verts.append((x,y,z))
faces=[]
for j in range(nv):
    for i in range(nu):
        a=j*(nu+1)+i
        faces.append((a,a+1,a+nu+2,a+nu+1))
mesh=bpy.data.meshes.new('Cape · cloth surface')
mesh.from_pydata(verts,[],faces)
obj=bpy.data.objects.new('Cape · closed royal cloth',mesh)
bpy.context.collection.objects.link(obj)
mesh.materials.append(cape_mat)
mesh.materials.append(cape_lining)
for p in mesh.polygons: p.use_smooth=True
solid=obj.modifiers.new('Real sewn cloth thickness','SOLIDIFY')
solid.thickness=.038
solid.material_offset=1
bpy.context.view_layer.objects.active=obj
bpy.ops.object.modifier_apply(modifier=solid.name)
parent_keep_world(obj,body_pivot)
for name,indices in [
    ('Cape · gold left edge',[j*(nu+1) for j in range(nv+1)]),
    ('Cape · gold right edge',[j*(nu+1)+nu for j in range(nv+1)]),
    ('Cape · gold scalloped hem',[nv*(nu+1)+i for i in range(nu+1)]),
]:
    tube(name,[verts[i] for i in indices],.022,gold_light,body_pivot,3)
profile('Cape · shoulder clasp outer',[(-.82,2.04),(-.31,2.13),(-.10,1.96),(-.74,1.91)],-.43,.16,gold_light,body_pivot,.035)
profile('Cape · shoulder blue enamel',[(-.79,2.04),(-.33,2.105),(-.15,1.98),(-.72,1.94)],-.465,-.43,cape_mat,body_pivot,.025)
cylinder('Cape · gold circular brooch',(-.34,-.47,2.035),(-.34,-.515,2.035),.085,gold_light,body_pivot,28)
sphere('Cape · brooch dome',(-.34,-.535,2.035),(.064,.023,.064),gold_light,body_pivot,20,10)

# Floating squares have independent origins for restrained frontend motion.
tile_positions=[(1.53,-.32,2.53),(1.88,-.23,2.86),(2.10,-.09,3.22),(2.10,.01,3.58),(1.90,.015,3.92),(1.56,-.04,4.15)]
for i,pos in enumerate(tile_positions):
    pivot=empty('Data_Tile_'+str(i+1).zfill(2),pos,root)
    size=.31 if i in [0,2,4] else .35
    box('Tile '+str(i+1)+' · gold rim',pos,(size+.035,.085,size+.035),gold_light,pivot,.042,segments=3)
    box('Tile '+str(i+1)+' · enamel face',(pos[0],pos[1]-.05,pos[2]),(size,.055,size),cobalt if i%2 else ivory_light,pivot,.04,segments=3)
    pivot.rotation_euler=(math.radians(9*(-1 if i%2 else 1)),math.radians(-12+i*7),math.radians(-15+i*4))

# Gentle one-time pose; frontend is free to layer tiny motion over these pivots.
head_pivot.rotation_euler=(math.radians(-4),math.radians(-12),math.radians(-7))
body_pivot.rotation_euler=(0,0,math.radians(3))
bpy.context.view_layer.update()

# Export an optimized duplicate hierarchy, retaining every editable source part.
# Joining each pivot's rigid geometry preserves material primitives while reducing
# 221 tiny object nodes to ten draw groups and roughly forty material draw calls.
bpy.ops.object.select_all(action='DESELECT')
model_objects=[root]+list(root.children_recursive)
pivots=[obj for obj in model_objects if obj.type=='EMPTY']
source_names={obj:obj.name for obj in pivots}
for obj in pivots: obj.name='EDITABLE__'+source_names[obj]
optimized=[]
mapping={}
for obj in pivots:
    new=obj.copy()
    new.name=source_names[obj]
    bpy.context.collection.objects.link(new)
    mapping[obj]=new
    optimized.append(new)
for obj,new in mapping.items():
    world=obj.matrix_world.copy()
    new.parent=mapping.get(obj.parent)
    new.matrix_world=world
draw_calls=0
for pivot in pivots:
    parts=[]
    for obj in model_objects:
        if obj.type=='MESH' and obj.parent==pivot:
            duplicate=obj.copy()
            duplicate.data=obj.data.copy()
            bpy.context.collection.objects.link(duplicate)
            duplicate.parent=mapping[pivot]
            duplicate.matrix_world=obj.matrix_world.copy()
            parts.append(duplicate)
    if parts:
        bpy.ops.object.select_all(action='DESELECT')
        for part in parts: part.select_set(True)
        bpy.context.view_layer.objects.active=parts[0]
        bpy.ops.object.join()
        merged=bpy.context.object
        merged.name=source_names[pivot]+'__RigidGeometry'
        draw_calls+=len(merged.data.materials)
        optimized.append(merged)
bpy.ops.object.select_all(action='DESELECT')
for obj in optimized: obj.select_set(True)
bpy.context.view_layer.objects.active=mapping[root]
OUT.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(OUT),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True,export_cameras=False,export_lights=False,export_texcoords=False,export_normals=True,export_materials='EXPORT')
optimized_meshes=sum(obj.type=='MESH' for obj in optimized)
for obj in reversed(optimized): bpy.data.objects.remove(obj,do_unlink=True)
for obj,name in source_names.items(): obj.name=name

# Orthographic transparent studio portrait. All setup stays in this saved source.
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=1280
scene.render.resolution_y=1280
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.render.filepath=str(PREVIEW)
scene.world.color=(.4,.4,.4)
scene.world.use_nodes=True
background=next(node for node in scene.world.node_tree.nodes if node.type=='BACKGROUND')
background.inputs['Color'].default_value=(.60,.65,.8,1)
background.inputs['Strength'].default_value=.45
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=-.4

def area(name,loc,power,size,color,target=(0,0,2)):
    data=bpy.data.lights.new(name,'AREA')
    data.energy=power
    data.shape='DISK'
    data.size=size
    data.color=color
    obj=bpy.data.objects.new(name,data)
    bpy.context.collection.objects.link(obj)
    obj.location=loc
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
area('Studio · large warm key',(-3,-4,7),700,5,(1,.86,.67))
area('Studio · soft front fill',(4,-3,4),450,4,(.77,.85,1))
area('Studio · blue rim',(1,3,5),1050,3,(.43,.58,1))
area('Studio · crown strip',(-2,1,6),750,3,(1,.86,.66))
camera_data=bpy.data.cameras.new('Studio · hero orthographic')
camera=bpy.data.objects.new('Studio · hero orthographic',camera_data)
bpy.context.collection.objects.link(camera)
camera.location=(5.4,-9.5,5.2)
target=Vector((.18,0,2.12))
camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO'
camera_data.ortho_scale=5.3
camera_data.lens=50
scene.camera=camera

points=[obj.matrix_world@Vector(corner) for obj in model_objects if obj.type=='MESH' for corner in obj.bound_box]
mins=[min(p[i] for p in points) for i in range(3)]
maxs=[max(p[i] for p in points) for i in range(3)]
triangles=sum(sum(len(p.vertices)-2 for p in obj.data.polygons) for obj in model_objects if obj.type=='MESH')
metadata={
    'asset':'Kohelet Robot King','generator':'Blender 5.2.1, custom original mesh geometry',
    'front':'Blender -Y; glTF +Z','up':'Blender +Z; glTF +Y','feetOrigin':0,
    'blenderBounds':{'min':mins,'max':maxs},
    'gltfBounds':{'min':[mins[0],mins[2],-maxs[1]],'max':[maxs[0],maxs[2],-mins[1]]},
    'triangles':triangles,'editableMeshObjects':sum(obj.type=='MESH' for obj in model_objects),
    'exportedMeshObjects':optimized_meshes,'materialDrawCalls':draw_calls,'exportedNodes':len(pivots)+optimized_meshes,
    'bytes':OUT.stat().st_size,
    'pivots':['Robot_Root','Body_Pivot','Head_Pivot','Arm_R_Pivot','Arm_L_Pivot']+['Data_Tile_'+str(i).zfill(2) for i in range(1,7)],
    'camera':{'blenderPosition':list(camera.location),'blenderTarget':list(target),'orthographicScale':camera_data.ortho_scale,'gltfPosition':[camera.location.x,camera.location.z,-camera.location.y],'gltfTarget':[target.x,target.z,-target.y]},
    'materials':sorted({mat.name for obj in model_objects if obj.type=='MESH' for mat in obj.data.materials}),
    'animation':'No baked animation. Named pivots preserve the authored pose and support tiny frontend offsets.',
}
(SOURCE.parent/'asset-metadata.json').write_text(json.dumps(metadata,indent=2))
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE))
print('ROBOT_ASSET_METADATA',json.dumps(metadata))
bpy.ops.render.render(write_still=True)
scene.render.image_settings.file_format='WEBP'
scene.render.image_settings.quality=94
bpy.data.images['Render Result'].save_render(filepath=str(POSTER),scene=scene)
print('ROBOT_POSTER',str(POSTER),POSTER.stat().st_size)
