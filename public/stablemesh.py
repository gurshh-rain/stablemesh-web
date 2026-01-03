bl_info = {
    "name": "StableMesh",
    "author": "Gurshaan Gill",
    "version": (1, 3, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > StableMesh",
    "description": "One-click stability score and torque heatmap",
    "category": "3D View",
}

import bpy
import bmesh
from mathutils import Vector, geometry

def get_physics_data(obj):
    """Calculates Support Hull, Center of Mass, and Height in one pass."""
    matrix = obj.matrix_world
    mesh = obj.data
    world_verts = [matrix @ v.co for v in mesh.vertices]
    
    if not world_verts: return None
    
    # 1. Dimensions
    min_z = min(v.z for v in world_verts)
    max_z = max(v.z for v in world_verts)
    height = max_z - min_z
    
    # 2. Support Hull (Bottom 1% of mesh)
    threshold = max(0.001, height * 0.01)
    base_points = [Vector((v.x, v.y)) for v in world_verts if abs(v.z - min_z) < threshold]
    hull = [base_points[i] for i in geometry.convex_hull_2d(base_points)] if len(base_points) >= 3 else None
    
    # 3. Volumetric Center of Mass
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.transform(matrix)
    com = Vector((0, 0, 0))
    total_vol = 0
    for face in bm.faces:
        if len(face.verts) < 3: continue
        v1 = face.verts[0].co
        for i in range(1, len(face.verts)-1):
            v2, v3 = face.verts[i].co, face.verts[i+1].co
            vol = (v1.dot(v2.cross(v3))) / 6.0
            com += (v1 + v2 + v3) / 4.0 * vol
            total_vol += vol
    bm.free()
    
    com_final = com / total_vol if abs(total_vol) > 1e-6 else matrix.translation
    return {"hull": hull, "height": height, "min_z": min_z, "com": com_final}

class STABLEMESH_OT_analyze(bpy.types.Operator):
    bl_idname = "stablemesh.analyze"
    bl_label = "Analyze StableMesh"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        obj = context.active_object
        data = get_physics_data(obj)
        if not data or not data["hull"]:
            self.report({'ERROR'}, "Object needs a flat base (3+ ground points)")
            return {'CANCELLED'}

        hull, com, height, min_z = data["hull"], data["com"], data["height"], data["min_z"]
        hull_center = sum(hull, Vector((0,0))) / len(hull)
        max_base_rad = max((p - hull_center).length for p in hull)
        
        # Calculate Score (Distance of CoM from Hull Center)
        com_2d = Vector((com.x, com.y))
        dist_com = (com_2d - hull_center).length
        
        # Check if CoM is inside hull
        is_inside = False
        n = len(hull)
        for i in range(n):
            j = (i + 1) % n
            if ((hull[i].y > com_2d.y) != (hull[j].y > com_2d.y)) and \
               (com_2d.x < (hull[j].x - hull[i].x) * (com_2d.y - hull[i].y) / (hull[j].y - hull[i].y) + hull[i].x):
                is_inside = not is_inside
        
        obj["stability_score"] = max(0, 100 * (1.0 - (dist_com / (max_base_rad + 0.1)))) if is_inside else 0.0

        # Heatmap Coloring
        mesh = obj.data
        color_layer = (mesh.color_attributes.get("Stability") or 
                       mesh.attributes.new(name="Stability", type='FLOAT_COLOR', domain='POINT'))

        for i, v in enumerate(mesh.vertices):
            w_pos = obj.matrix_world @ v.co
            # Torque = Dist Outside Base * Height Leverage
            dist_out = max(0, (Vector((w_pos.x, w_pos.y)) - hull_center).length - max_base_rad)
            h_weight = (w_pos.z - min_z) / (height + 0.001)
            torque = (dist_out / (max_base_rad + 0.1)) * (1.0 + h_weight * 2.5)
            torque = max(0, min(1, torque))

            # Heatmap: Blue (Anchored) -> Orange -> Hot Red (Falling)
            if torque < 0.15: col = (0.05, 0.1, 0.3, 1.0)
            elif torque < 0.6:
                t = (torque - 0.15) / 0.45
                col = (0.8 * t, 0.2 * t, 0.3 - 0.2 * t, 1.0)
            else:
                t = (torque - 0.6) / 0.4
                col = (1.0, 0.8 - 0.8 * t, 0.0, 1.0)
            color_layer.data[i].color = col

        # Auto-Viewport
        context.space_data.shading.type = 'SOLID'
        try: context.space_data.shading.color_type = 'VERTEX'
        except: context.space_data.shading.color_type = 'ATTRIBUTE'
        
        return {'FINISHED'}

class STABLEMESH_PT_panel(bpy.types.Panel):
    bl_label = "StableMesh Pro"
    bl_idname = "STABLEMESH_PT_panel"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'StableMesh'

    def draw(self, context):
        layout = self.layout
        obj = context.active_object
        
        col = layout.column(align=True)
        col.scale_y = 1.4
        col.operator("stablemesh.analyze", icon='PHYSICS', text="RUN ANALYSIS")

        if obj and "stability_score" in obj:
            score = obj["stability_score"]
            box = layout.box()
            row = box.row()
            
            # Visual Score System
            if score > 75: 
                row.label(text=f"Score: {score:.1f}%", icon='SOLO_ON')
                box.label(text="Status: EXCELLENT", icon='CHECKMARK')
            elif score > 0:
                row.label(text=f"Score: {score:.1f}%", icon='SOLO_OFF')
                box.label(text="Status: UNSTABLE", icon='ERROR')
            else:
                row.label(text="Score: 0.0%", icon='CANCEL')
                box.label(text="Status: FALLING", icon='CANCEL')
            
            box.progress(factor=score/100, text="Stability Margin")

def register():
    bpy.utils.register_class(STABLEMESH_OT_analyze)
    bpy.utils.register_class(STABLEMESH_PT_panel)

def unregister():
    bpy.utils.unregister_class(STABLEMESH_OT_analyze)
    bpy.utils.unregister_class(STABLEMESH_PT_panel)

if __name__ == "__main__":
    register()