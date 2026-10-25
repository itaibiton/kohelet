"""Build Kohelet's original, editable Robot King from mesh geometry.

Run with Blender 5.2+ in an isolated process:
  Blender --background --factory-startup --python tools/robot-king/build_robot_king.py

No scene assets, external textures, generation services, or open Blender files are used.
Model faces -Y in Blender; feet sit at Z=0. The glTF exporter converts Z up to Y up.
"""
import bpy
import json
import math
import struct
import numpy as np
from pathlib import Path
from mathutils import Vector, Matrix

BASE = Path(__file__).resolve().parents[2]
OUT = BASE / "public/models/kohelet-robot-king.glb"
SOURCE = Path(__file__).resolve().parent / "kohelet-robot-king.blend"
PREVIEW = Path(__file__).resolve().parent / "preview.png"
POSTER = BASE / "public/images/codex-landing/robot-king-performance-poster.webp"

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic=0, roughness=.76, coat=.0, emission=0, sheen=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = True
    node = next(node for node in mat.node_tree.nodes if node.type == 'BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value = (*color, 1)
    node.inputs['Metallic'].default_value = metallic
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Coat Weight'].default_value = coat
    # A nonzero clearcoat roughness exports the clearcoat extension even when
    # coat weight is zero, needlessly choosing Three's heavier Physical shader.
    node.inputs['Coat Roughness'].default_value = .18 if coat else 0
    node.inputs['Sheen Weight'].default_value = sheen
    if emission:
        node.inputs['Emission Color'].default_value = (*color, 1)
        node.inputs['Emission Strength'].default_value = emission
    mat.diffuse_color = (*color, 1)
    return mat

ivory = material('Ceramic · warm sandstone', (.43,.32,.205), .0,.80)
ivory_light = material('Ceramic · pale sand edge', (.61,.48,.315), .0,.78)
gold = material('Metal · brushed antique gold', (.48,.23,.055), .72,.61)
gold_light = material('Metal · warm brass bevel', (.63,.37,.115), .72,.59)
chrome = material('Metal · brushed titanium', (.22,.26,.29), .72,.63)
joint = material('Joint · dark graphite', (.018,.025,.033), .0,.80)
cobalt = material('Ceramic · Kohelet cobalt', (.009,.028,.32), .0,.77)
sapphire = material('Gem · satin sapphire blue', (.009,.025,.22), .0,.65)
visor = material('Visor · midnight mineral', (.004,.011,.033), .0,.65)
visor_edge = material('Visor · satin cobalt edge', (.018,.039,.21), .0,.72)
# White Principled sheen exports as a pale glTF sheen lobe under browser studio
# environments. Keep these two cloth materials sheen-free to retain royal blue.
cape_mat = material('Cape · royal cobalt fabric', (.012,.025,.28), .0,.85)
cape_lining = material('Cape · matte inner blue', (.018,.05,.37), .0,.82)
led = material('Display · warm ivory LEDs', (1,.60,.16), .0,.65,emission=2)
led_dim = material('Display · dark pixel substrate', (.018,.035,.15), .2,.26)

# Real, tiny seamless surface textures are embedded in glTF. No runtime noise or
# procedural shader work: each surface family samples two tiny 128px maps.
def surface_maps(name, brushed=False):
    size=128
    rng=np.random.default_rng(21 if brushed else 11)
    grain=rng.random((size,size)).astype(np.float32)
    for _ in range(2):
        grain=(grain*4+np.roll(grain,1,0)+np.roll(grain,-1,0)+np.roll(grain,1,1)+np.roll(grain,-1,1))/8
    grain-=grain.mean()
    grain/=max(float(np.abs(grain).max()),.001)
    if brushed:
        y=np.arange(size,dtype=np.float32)[:,None]
        grain=.70*grain+.30*np.sin(y*2*np.pi*19/size)
    dx=np.roll(grain,-1,1)-np.roll(grain,1,1)
    dy=np.roll(grain,-1,0)-np.roll(grain,1,0)
    normal=np.dstack((-dx*.17,-dy*.17,np.ones_like(grain)))
    normal/=np.linalg.norm(normal,axis=2,keepdims=True)
    normals=np.ones((size,size,4),dtype=np.float32)
    normals[:,:,:3]=normal*.5+.5
    rough=np.ones_like(normals)
    rough[:,:,:3]=np.clip((.61 if brushed else .79)+grain[:,:,None]*.055,0,1)
    outputs=[]
    for suffix,pixels in [('normal',normals),('roughness',rough)]:
        image=bpy.data.images.new(name+' · '+suffix,width=size,height=size,alpha=False)
        image.colorspace_settings.name='Non-Color'
        image.pixels.foreach_set(pixels.ravel())
        image.pack()
        outputs.append(image)
    return outputs

stone_maps=surface_maps('Sand ceramic micrograin')
metal_maps=surface_maps('Antique metal brushing',True)
def surface_nodes(mat, maps):
    nodes=mat.node_tree.nodes
    links=mat.node_tree.links
    shader=next(node for node in nodes if node.type=='BSDF_PRINCIPLED')
    normal_texture=nodes.new('ShaderNodeTexImage')
    normal_texture.image=maps[0]
    normal_texture.interpolation='Linear'
    normal=nodes.new('ShaderNodeNormalMap')
    normal.inputs['Strength'].default_value=.45
    links.new(normal_texture.outputs['Color'],normal.inputs['Color'])
    links.new(normal.outputs['Normal'],shader.inputs['Normal'])
    roughness_texture=nodes.new('ShaderNodeTexImage')
    roughness_texture.image=maps[1]
    links.new(roughness_texture.outputs['Color'],shader.inputs['Roughness'])

for mat in [ivory,ivory_light,joint,cobalt,sapphire,visor,visor_edge,cape_mat,cape_lining]:
    surface_nodes(mat,stone_maps)
for mat in [gold,gold_light,chrome]:
    surface_nodes(mat,metal_maps)

# Vertex tint keeps the complete authored palette while each rigid joint needs
# only one matte and one metal material, plus a small emissive face primitive.
export_stone=material('Delivery · matte mineral palette',(1,1,1),0,.79)
export_metal=material('Delivery · brushed antique metal palette',(1,1,1),.72,.61)
export_led=material('Delivery · warm display pixels',(1,.60,.16),0,.65,emission=2)
for mat,maps in [(export_stone,stone_maps),(export_metal,metal_maps)]:
    surface_nodes(mat,maps)
    shader=next(node for node in mat.node_tree.nodes if node.type=='BSDF_PRINCIPLED')
    color=mat.node_tree.nodes.new('ShaderNodeVertexColor')
    color.layer_name='SurfaceTint'
    mat.node_tree.links.new(color.outputs['Color'],shader.inputs['Base Color'])

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
torso_pivot = empty('Torso_Pivot', (0,0,1.38), body_pivot)
head_pivot = empty('Head_Pivot', (0,0,2.82), torso_pivot)
arm_r = empty('Arm_R_Pivot', (-.65,0,1.85), torso_pivot)
arm_l = empty('Arm_L_Pivot', (.65,0,1.85), torso_pivot)
elbow_pivots = {}
wrist_pivots = {}
for side,label,shoulder in [(-1,'R',arm_r),(1,'L',arm_l)]:
    elbow_pivots[label] = empty('Elbow_'+label+'_Pivot', (side*.81,.01,1.49), shoulder)
    wrist_pivots[label] = empty('Wrist_'+label+'_Pivot', (side*.81,-.36,1.49), elbow_pivots[label])
cape_pivot = empty('Cape_Pivot', (0,.29,2.01), torso_pivot)
eye_pivots = {}
brow_pivots = {}
for side,label in [(-1,'R'),(1,'L')]:
    eye_pivots[label] = empty('Eye_'+label+'_Pivot', (side*.40,-.772,2.98), head_pivot)
    brow_pivots[label] = empty('Brow_'+label+'_Pivot', (side*.40,-.778,3.195), head_pivot)
smile_pivot = empty('Smile_Pivot', (0,-.655,2.44), head_pivot)
leg_pivots = {}
for side,label in [(-1,'R'),(1,'L')]:
    hip = empty('Leg_'+label+'_Pivot', (side*.39,0,1.14), body_pivot)
    knee = empty('Knee_'+label+'_Pivot', (side*.39,0,.73), hip)
    boot = empty('Boot_'+label+'_Pivot', (side*.39,0,.38), knee)
    leg_pivots[label] = (hip,knee,boot)

def finish(obj, name, mat, parent, bevel=0, segments=3):
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Manufactured soft edge', 'BEVEL')
        mod.width = bevel
        mod.segments = min(segments,3)
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
    bpy.ops.mesh.primitive_uv_sphere_add(segments=min(segments,16), ring_count=min(rings,10), radius=1, location=loc)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, parent)

def cylinder(name, a, b, radius, mat, parent=body_pivot, vertices=24, bevel=.012):
    a,b = Vector(a),Vector(b)
    delta = b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=min(vertices,20), radius=radius, depth=delta.length, location=(a+b)/2)
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

# Two neutral open eyes have their own rigid controls. Runtime can blink, glance,
# focus and wink deliberately; the model no longer has a permanent expression.
def pixels(name, center, pattern, parent):
    spacing=.039
    for row,line in enumerate(pattern):
        for col,cell in enumerate(line):
            if cell=='1':
                box(name+' '+str(row)+'-'+str(col),(center[0]+(col-(len(line)-1)/2)*spacing,-.772,center[1]-(row-(len(pattern)-1)/2)*spacing),(.031,.018,.031),led,parent,.004,segments=1)
open_eye=['011110','111111','110011','110011','110011','110011','111111','011110']
for side,label in [(-1,'R'),(1,'L')]:
    pixels('Eye '+label+' · open digital display',(side*.40,2.98),open_eye,eye_pivots[label])
    box('Brow '+label+' · expressive warm display',(side*.40,-.778,3.195),(.245,.018,.027),led,brow_pivots[label],.009,segments=2)
tube('Smile · warm gold arc',[(-.16,-.624,2.475),(-.09,-.648,2.44),(0,-.655,2.43),(.09,-.648,2.44),(.16,-.624,2.475)],.015,led,smile_pivot,8)
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
cylinder('Neck · chrome swivel',(0,0,1.98),(0,0,2.16),.24,chrome,torso_pivot,28)
cylinder('Neck · cobalt collar',(0,0,2.02),(0,0,2.12),.285,cobalt,torso_pivot,28)
chest=[(-.62,1.96),(.62,1.96),(.56,1.55),(.36,1.18),(-.36,1.18),(-.56,1.55)]
profile('Body · outer gold seam',chest,-.43,.34,gold,torso_pivot,.13)
profile('Body · ivory chest shell',[(x*.95,1.6+(z-1.6)*.95) for x,z in chest],-.467,.31,ivory,torso_pivot,.12)
box('Body · sapphire chest frame',(0,-.523,1.72),(.30,.12,.32),gold_light,torso_pivot,.055)
gem('Body · faceted sapphire chest',(0,-.608,1.73),(.22,.08,.24),torso_pivot)
profile('Body · lower abdomen shield',[(-.27,1.46),(.27,1.46),(.21,1.16),(-.21,1.16)],-.57,-.44,ivory_light,body_pivot,.075)
cylinder('Waist · articulated graphite swivel',(0,0,1.11),(0,0,1.30),.27,joint,body_pivot,24)
cylinder('Waist · brass hip collar',(0,0,1.12),(0,0,1.18),.29,gold,body_pivot,24)
box('Body · back service hatch',(0,.354,1.65),(.62,.055,.42),cobalt,torso_pivot,.08)
for side in [-1,1]:
    for z in [1.51,1.60,1.69]:
        box('Body · side vent '+str(side)+' '+str(z),(side*.54,.025,z),(.035,.32,.038),joint,torso_pivot,.01,rotation=(0,side*.15,0))

# Articulated legs: hip -> knee -> ankle, with meaningful local X pitch axes.
# The glTF neutral rig is straight and unanimated; the poster gets a sample stride.
for side,label in [(-1,'R'),(1,'L')]:
    x=side*.39
    hip,knee,boot=leg_pivots[label]
    sphere('Hip · swivel '+label,(x,0,1.14),(.18,.18,.18),chrome,hip)
    cylinder('Leg · thigh dark core '+label,(x,0,1.10),(x,0,.75),.125,joint,hip)
    cylinder('Leg · ivory upper armor '+label,(x,0,1.04),(x,0,.79),.17,ivory,hip,24,.035)
    sphere('Knee · titanium joint '+label,(x,0,.73),(.145,.15,.145),chrome,knee)
    cylinder('Shin · titanium core '+label,(x,0,.72),(x,0,.38),.115,chrome,knee)
    cylinder('Shin · ivory upper cuff '+label,(x,0,.65),(x,0,.52),.135,ivory,knee,24,.025)
    box('Boot · raised cobalt cuff '+label,(x,-.02,.43),(.46,.50,.36),cobalt,boot,.10,segments=4)
    box('Boot · gold sole '+label,(x,-.19,.085),(.66,.96,.14),gold_light,boot,.065,segments=4)
    box('Boot · black outsole '+label,(x,-.19,.035),(.62,.91,.07),joint,boot,.032,segments=3)
    box('Boot · rounded cobalt toe '+label,(x,-.24,.25),(.63,.88,.40),cobalt,boot,.18,segments=5)
    tube('Boot · ivory toe seam '+label,[(x-.26,-.58,.20),(x,-.65,.22),(x+.26,-.58,.20)],.012,ivory_light,boot)
    cylinder('Boot · ankle gold disk '+label,(x+side*.22,0,.40),(x+side*.28,0,.40),.125,gold_light,boot,24)
    cylinder('Boot · ankle inset '+label,(x+side*.278,0,.40),(x+side*.295,0,.40),.092,ivory,boot,24)

# Each arm is a real hierarchy with machined sleeves, joint rings and fingers.
def limb(prefix, a, b, radius, parent):
    cylinder(prefix+' · titanium core',a,b,radius*.74,chrome,parent)
    a,b=Vector(a),Vector(b)
    cylinder(prefix+' · ivory sleeve',a.lerp(b,.16),a.lerp(b,.84),radius,ivory,parent,24,.035)
    cylinder(prefix+' · gold seam',a.lerp(b,.80),a.lerp(b,.85),radius*1.02,gold_light,parent,24,.008)

for side,label,parent in [(-1,'R',arm_r),(1,'L',arm_l)]:
    shoulder=(side*.67,0,1.86)
    sphere('Shoulder · chrome swivel '+str(side),shoulder,(.20,.20,.20),chrome,parent)
    cylinder('Shoulder · sapphire socket '+str(side),(side*.56,0,1.86),(side*.72,0,1.86),.22,cobalt,parent,28)
    elbow=(side*.81,.01,1.49)
    wrist=(side*.81,-.36,1.49)
    limb('Arm '+str(side)+' upper',shoulder,elbow,.17,parent)
    sphere('Elbow · titanium ball '+str(side),elbow,(.155,.155,.155),chrome,elbow_pivots[label])
    limb('Arm '+str(side)+' lower',elbow,wrist,.195,elbow_pivots[label])
    sphere('Wrist · titanium ball '+str(side),wrist,(.12,.12,.12),chrome,wrist_pivots[label])

# Compact ceramic fists keep four articulated fingers and a distinct thumb.
for side,label,parent in [(-1,'R',wrist_pivots['R']),(1,'L',wrist_pivots['L'])]:
    center=side*.81
    box('Palm_'+label+' · compact fist',(center,-.48,1.49),(.34,.29,.29),ivory_light,parent,.075,segments=4)
    box('Palm_'+label+' · sapphire back inset',(center,-.49,1.65),(.14,.13,.025),cobalt,parent,.035)
    for i in range(4):
        x=center+(i-1.5)*.078
        points=[(x,-.54,1.57),(x,-.65,1.56),(x,-.66,1.46),(x,-.57,1.42)]
        for j,(a,b) in enumerate(zip(points,points[1:])):
            sphere('Finger_'+label+' joint '+str(i)+' '+str(j),a,(.038,.038,.038),chrome,parent,12,8)
            cylinder('Finger_'+label+' curled segment '+str(i)+' '+str(j),a,b,.042,ivory_light,parent,12,.014)
    thumb=[(center-side*.16,-.45,1.51),(center-side*.19,-.57,1.52),(center-side*.08,-.64,1.49)]
    for j,(a,b) in enumerate(zip(thumb,thumb[1:])):
        sphere('Thumb_'+label+' joint '+str(j),a,(.055,.055,.055),chrome,parent,12,8)
        cylinder('Thumb_'+label+' armor '+str(j),a,b,.058,ivory,parent,14,.019)

# Real double-sided closed cape mesh, softly folded and asymmetric at the hem.
nu,nv=22,14
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
parent_keep_world(obj,cape_pivot)
for name,indices in [
    ('Cape · gold left edge',[j*(nu+1) for j in range(nv+1)]),
    ('Cape · gold right edge',[j*(nu+1)+nu for j in range(nv+1)]),
    ('Cape · gold scalloped hem',[nv*(nu+1)+i for i in range(nu+1)]),
]:
    tube(name,[verts[i] for i in indices],.022,gold_light,cape_pivot,3)
profile('Cape · shoulder clasp outer',[(-.82,2.04),(-.31,2.13),(-.10,1.96),(-.74,1.91)],-.43,.16,gold_light,torso_pivot,.035)
profile('Cape · shoulder blue enamel',[(-.79,2.04),(-.33,2.105),(-.15,1.98),(-.72,1.94)],-.465,-.43,cape_mat,torso_pivot,.025)
cylinder('Cape · gold circular brooch',(-.34,-.47,2.035),(-.34,-.515,2.035),.085,gold_light,torso_pivot,28)
sphere('Cape · brooch dome',(-.34,-.535,2.035),(.064,.023,.064),gold_light,torso_pivot,20,10)

# Floating squares stream behind the runner rather than hovering over a palm.
tile_positions=[(1.05,.30,1.15),(1.24,.40,1.34),(1.45,.50,1.52),(1.64,.60,1.70),(1.84,.70,1.86),(2.04,.80,2.03)]
for i,pos in enumerate(tile_positions):
    pivot=empty('Data_Tile_'+str(i+1).zfill(2),pos,root)
    size=.31 if i in [0,2,4] else .35
    box('Tile '+str(i+1)+' · gold rim',pos,(size+.035,.085,size+.035),gold_light,pivot,.042,segments=3)
    box('Tile '+str(i+1)+' · enamel face',(pos[0],pos[1]-.05,pos[2]),(size,.055,size),cobalt if i%2 else ivory_light,pivot,.04,segments=3)
    pivot.rotation_euler=(math.radians(9*(-1 if i%2 else 1)),math.radians(-12+i*7),math.radians(-15+i*4))

# Neutral delivery pose; runtime supplies a continuously articulated running gait.
head_pivot.rotation_euler=(math.radians(-4),math.radians(-12),math.radians(-7))
body_pivot.rotation_euler=(0,0,math.radians(3))
bpy.context.view_layer.update()

# UVs use a fixed physical density, so ceramic grains remain the same size on
# head armor, finger segments, boots and cloth instead of stretching per part.
for obj in [root]+list(root.children_recursive):
    if obj.type!='MESH': continue
    while obj.data.uv_layers: obj.data.uv_layers.remove(obj.data.uv_layers[0])
    uv=obj.data.uv_layers.new(name='SurfaceGrain')
    for polygon in obj.data.polygons:
        normal=obj.matrix_world.to_3x3()@polygon.normal
        axis=max(range(3),key=lambda axis:abs(normal[axis]))
        projected=[i for i in range(3) if i!=axis]
        for index in polygon.loop_indices:
            point=obj.matrix_world@obj.data.vertices[obj.data.loops[index].vertex_index].co
            uv.data[index].uv=(point[projected[0]]*5,point[projected[1]]*5)

# Export an optimized duplicate hierarchy, retaining every editable source part.
# Join rigid parts by pivot and consolidate their color palette into vertex tint.
# Two tactile material families retain all colors with far fewer draw calls.
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
        # Identity child transforms put local vertex coordinates at the actual
        # articulation hinge, useful for runtime cape deformation and IK audits.
        relative=mapping[pivot].matrix_world.inverted()@merged.matrix_world
        merged.data.transform(relative)
        merged.matrix_parent_inverse=Matrix.Identity(4)
        merged.matrix_basis=Matrix.Identity(4)
        merged.data.update()
        bpy.context.view_layer.update()
        previous_materials=list(merged.data.materials)
        tint=merged.data.color_attributes.new(name='SurfaceTint',type='FLOAT_COLOR',domain='CORNER')
        merged.data.color_attributes.active_color=tint
        while merged.data.uv_layers: merged.data.uv_layers.remove(merged.data.uv_layers[0])
        uv=merged.data.uv_layers.new(name='SurfaceGrain')
        target_materials=[]
        target_indices=[]
        for polygon in merged.data.polygons:
            original=previous_materials[polygon.material_index]
            target=export_led if original==led else export_metal if original in [gold,gold_light,chrome] else export_stone
            if target not in target_materials: target_materials.append(target)
            target_indices.append(target_materials.index(target))
            color=original.diffuse_color[:3]
            normal=merged.matrix_world.to_3x3()@polygon.normal
            axis=max(range(3),key=lambda axis:abs(normal[axis]))
            projected=[i for i in range(3) if i!=axis]
            for index in polygon.loop_indices:
                point=merged.matrix_world@merged.data.vertices[merged.data.loops[index].vertex_index].co
                # Very slight mineral variation avoids large flat plastic areas.
                mineral=1+.018*math.sin(point.x*13.3+point.z*8.7)*math.sin(point.y*11.1+point.z*5.7)
                tint.data[index].color=(*(min(1,c*mineral) for c in color),1)
                uv.data[index].uv=(point[projected[0]]*5,point[projected[1]]*5)
        merged.data.materials.clear()
        for mat in target_materials: merged.data.materials.append(mat)
        for polygon,index in zip(merged.data.polygons,target_indices): polygon.material_index=index
        draw_calls+=len(merged.data.materials)
        optimized.append(merged)
bpy.ops.object.select_all(action='DESELECT')
for obj in optimized: obj.select_set(True)
bpy.context.view_layer.objects.active=mapping[root]
OUT.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(OUT),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True,export_cameras=False,export_lights=False,export_texcoords=True,export_normals=True,export_materials='EXPORT')

# glTF supports normalized byte colors without an extension. Blender exports
# FLOAT VEC3 colors, so pack those as UBYTE VEC4 (opaque alpha), saving ~250KiB
# while preserving the vertex-tinted palette to within 1/255 linear intensity.
delivery=OUT.read_bytes()
json_size=struct.unpack_from('<I',delivery,12)[0]
delivery_document=json.loads(delivery[20:20+json_size])
# Blender emits a roughness-only clearcoat extension for the zero-weight lobe.
# glTF defaults its factor to zero: removing that no-op keeps StandardMaterial.
for delivered_material in delivery_document['materials']:
    extensions=delivered_material.get('extensions',{})
    coat=extensions.get('KHR_materials_clearcoat')
    if coat is not None:
        assert not coat.get('clearcoatFactor',0) and not coat.get('clearcoatTexture')
        del extensions['KHR_materials_clearcoat']
    if not extensions: delivered_material.pop('extensions',None)
if 'extensionsUsed' in delivery_document:
    delivery_document['extensionsUsed']=[name for name in delivery_document['extensionsUsed'] if name!='KHR_materials_clearcoat']
binary_offset=20+json_size+8
binary=delivery[binary_offset:]
replacement_views={}
color_accessors={primitive['attributes']['COLOR_0'] for mesh in delivery_document['meshes'] for primitive in mesh['primitives'] if 'COLOR_0' in primitive['attributes']}
for index in color_accessors:
    accessor=delivery_document['accessors'][index]
    if accessor['componentType']==5121:
        assert accessor['type']=='VEC4' and accessor.get('normalized')
        continue
    view=delivery_document['bufferViews'][accessor['bufferView']]
    assert accessor['componentType']==5126 and accessor['type']=='VEC3'
    assert not accessor.get('byteOffset') and not view.get('byteStride')
    values=np.frombuffer(binary,dtype='<f4',count=accessor['count']*3,offset=view.get('byteOffset',0)).reshape((-1,3))
    packed=np.full((accessor['count'],4),255,dtype=np.uint8)
    packed[:,:3]=np.rint(np.clip(values,0,1)*255).astype(np.uint8)
    replacement_views[accessor['bufferView']]=packed.tobytes()
    accessor.update({'componentType':5121,'type':'VEC4','normalized':True})
rebuilt=bytearray()
for index,view in enumerate(delivery_document['bufferViews']):
    content=replacement_views.get(index)
    if content is None: content=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
    rebuilt.extend(b'\0'*(-len(rebuilt)%4))
    view['byteOffset']=len(rebuilt)
    view['byteLength']=len(content)
    rebuilt.extend(content)
rebuilt.extend(b'\0'*(-len(rebuilt)%4))
delivery_document['buffers'][0]['byteLength']=len(rebuilt)
packed_json=json.dumps(delivery_document,separators=(',',':')).encode()
packed_json+=b' '*(-len(packed_json)%4)
total_size=12+8+len(packed_json)+8+len(rebuilt)
OUT.write_bytes(struct.pack('<III',0x46546c67,2,total_size)+struct.pack('<II',len(packed_json),0x4e4f534a)+packed_json+struct.pack('<II',len(rebuilt),0x004e4942)+rebuilt)
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
camera_data.ortho_scale=5.5
camera_data.lens=50
scene.camera=camera

points=[obj.matrix_world@Vector(corner) for obj in model_objects if obj.type=='MESH' for corner in obj.bound_box]
mins=[min(p[i] for p in points) for i in range(3)]
maxs=[max(p[i] for p in points) for i in range(3)]
triangles=sum(sum(len(p.vertices)-2 for p in obj.data.polygons) for obj in model_objects if obj.type=='MESH')
glb_bytes=OUT.read_bytes()
json_length=struct.unpack_from('<I',glb_bytes,12)[0]
glb_document=json.loads(glb_bytes[20:20+json_length])
parent_names={child:node.get('name') for node in glb_document['nodes'] for child in node.get('children',[])}
neutral_nodes={node['name']:{
    'parent':parent_names.get(index),
    'translation':node.get('translation',[0,0,0]),
    'quaternion':node.get('rotation',[0,0,0,1]),
    'scale':node.get('scale',[1,1,1]),
} for index,node in enumerate(glb_document['nodes']) if node.get('name') in source_names.values()}
cape_geometry=next(node for node in glb_document['nodes'] if node.get('name')=='Cape_Pivot__RigidGeometry')
cape_positions=[glb_document['accessors'][primitive['attributes']['POSITION']] for primitive in glb_document['meshes'][cape_geometry['mesh']]['primitives']]
cape_local_bounds={
    'min':[min(position['min'][axis] for position in cape_positions) for axis in range(3)],
    'max':[max(position['max'][axis] for position in cape_positions) for axis in range(3)],
}

# Match the runtime's literal running-in-place cycle for the saved studio pose.
# This happens AFTER the neutral glTF export and never bakes its gait into GLB.
rest_transforms={pivot:(pivot.location.copy(),pivot.rotation_euler.copy()) for pivot in pivots}
def sample_running_pose(phase):
    for pivot,(location,rotation) in rest_transforms.items():
        pivot.location=location.copy()
        pivot.rotation_euler=rotation.copy()
    stride=math.sin(phase)
    root.rotation_euler.z=-.62
    for label,value in [('R',stride),('L',-stride)]:
        hip,knee,boot=leg_pivots[label]
        hip_x=-.72*value
        knee_x=.16+1.05*max(0,-value)**2
        boot_x=-.16-.72*hip_x-.38*knee_x
        hip.rotation_euler.x+=hip_x
        knee.rotation_euler.x+=knee_x
        boot.rotation_euler.x+=boot_x
    arm_r.rotation_euler.x+=.82*stride
    arm_l.rotation_euler.x-=.82*stride
    elbow_pivots['R'].rotation_euler.x+=-.28-.16*stride
    elbow_pivots['L'].rotation_euler.x+=-.28+.16*stride
    wrist_pivots['R'].rotation_euler.y+=-.10
    wrist_pivots['L'].rotation_euler.y+=.10
    body_pivot.rotation_euler.x+=.16
    body_pivot.rotation_euler.z+=.045*stride
    body_pivot.rotation_euler.y-=.025*stride
    body_pivot.location.z+=.033+.09*math.cos(2*phase)
    torso_pivot.rotation_euler.x+=.09
    torso_pivot.rotation_euler.z+=-.12*stride
    head_pivot.rotation_euler.x+=-.09+.035*math.cos(2*phase)
    cape_pivot.rotation_euler.x+=.16+.08*math.sin(2*phase-.7)
    brow_pivots['R'].rotation_euler.y+=-.12
    brow_pivots['L'].rotation_euler.y+=.10
    bpy.context.view_layer.update()

contact_sweep=[]
running_points=[]
for frame in range(24):
    phase=2*math.pi*frame/24+math.pi/2
    sample_running_pose(phase)
    feet={}
    for label in ['R','L']:
        foot=leg_pivots[label][2]
        soles=[obj for obj in foot.children if obj.type=='MESH' and 'outsole' in obj.name]
        feet[label]=min((obj.matrix_world@vert.co).z for obj in soles for vert in obj.data.vertices)
    contact_sweep.append({'phase':phase,'rightFootMinZ':feet['R'],'leftFootMinZ':feet['L'],'lowestFootZ':min(feet.values())})
    running_points.extend(obj.matrix_world@Vector(corner) for obj in model_objects if obj.type=='MESH' for corner in obj.bound_box)
running_min=[min(point[i] for point in running_points) for i in range(3)]
running_max=[max(point[i] for point in running_points) for i in range(3)]
sample_running_pose(math.pi/2)

metadata={
    'asset':'Kohelet Robot King','generator':'Blender 5.2.1, custom original mesh geometry',
    'front':'Blender -Y; glTF +Z','up':'Blender +Z; glTF +Y','feetOrigin':0,
    'blenderBounds':{'min':mins,'max':maxs},
    'gltfBounds':{'min':[mins[0],mins[2],-maxs[1]],'max':[maxs[0],maxs[2],-mins[1]]},
    'triangles':triangles,'editableMeshObjects':sum(obj.type=='MESH' for obj in model_objects),
    'exportedMeshObjects':optimized_meshes,'materialDrawCalls':draw_calls,'exportedNodes':len(pivots)+optimized_meshes,
    'bytes':OUT.stat().st_size,
    'pivots':list(source_names.values()),
    'neutralNodeTransforms':neutral_nodes,
    'articulation':{'controls':len(pivots),'rigidMeshes':optimized_meshes,'meshChildrenHaveIdentityTransform':True,'torsoSeparatesUpperBodyFromHips':True,'independentElbowsAndWrists':True,'neutralEyes':'two open digital eyes','faceControls':['Eye_R_Pivot','Eye_L_Pivot','Brow_R_Pivot','Brow_L_Pivot','Smile_Pivot']},
    'capeDeformation':{'mesh':'Cape_Pivot__RigidGeometry','localBounds':cape_local_bounds,'hinge':[0,0,0],'hemDirection':'negative local Y','widthAxis':'local X','aftDirection':'negative local Z','fabricAndTrimShareCoordinates':True},
    'runningGltfBounds':{'min':[running_min[0],running_min[2],-running_max[1]],'max':[running_max[0],running_max[2],-running_min[1]]},
    'gaitContactSweep':contact_sweep,
    'posterPose':{'phaseRadians':math.pi/2,'rootYawRadians':-.62,'exportRemainsNeutral':True},
    'runtimeAxes':{'pitch':'local +X','yaw':'local +Y','roll':'local +Z','forward':'glTF +Z','hipForward':'negative X','kneeHeelBack':'positive X'},
    'camera':{'blenderPosition':list(camera.location),'blenderTarget':list(target),'orthographicScale':camera_data.ortho_scale,'gltfPosition':[camera.location.x,camera.location.z,-camera.location.y],'gltfTarget':[target.x,target.z,-target.y]},
    'materials':sorted({mat.name for obj in model_objects if obj.type=='MESH' for mat in obj.data.materials}),
    'deliveryMaterials':[mat['name'] for mat in glb_document['materials']],
    'embeddedTextureImages':len(glb_document.get('images',[])),
    'textureDimensions':[128,128],
    'surfaceFinish':'Warm matte sand ceramic, mineral cobalt and brushed antique gold. Embedded 128px normal/roughness maps with vertex-tinted palette; no clearcoat; all closed meshes use backface culling.',
    'animation':'Neutral articulated glTF rig for runtime action choreography. No baked animation. Saved Blender studio and poster show a three-quarter running stride.',
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
