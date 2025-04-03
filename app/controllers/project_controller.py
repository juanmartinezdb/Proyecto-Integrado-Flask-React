from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.project_service import ProjectService
from app.schemas.project_schema import ProjectSchema

project_bp = Blueprint('project_bp', __name__)
project_service = ProjectService()

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

@project_bp.route('', methods=['GET'])
@jwt_required()
def get_all_projects():
    """
    Soporta filtros:
      - zone_id (int)
      - status (ACTIVE, COMPLETED, ARCHIVED, etc.)
      - priority (HIGH, MEDIUM, LOW)
      - start_date y end_date (rango, según start_date o end_date del proyecto)
    Ejemplo:
      GET /projects?zone_id=3&status=ACTIVE
    """
    user_id = get_jwt_identity()
    query_params = request.args

    zone_id = query_params.get('zone_id')
    status = query_params.get('status')
    priority = query_params.get('priority')
    start_date = query_params.get('start_date')
    end_date = query_params.get('end_date')

    items = project_service.get_projects_with_filters(
        user_id=user_id,
        zone_id=zone_id,
        status=status,
        priority=priority,
        start_date=start_date,
        end_date=end_date
    )

    # Retornamos la lista de proyectos
    results = []
    for p in items:
        data = project_schema.dump(p)
        data['materials_ids'] = [m.id for m in p.materials if not m.deleted]
        results.append(data)
    return jsonify(results), 200

@project_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_by_id(project_id):
    """
    Devuelve el detalle ampliado del proyecto, incluyendo materiales, hábitos, etc.
    """
    user_id = get_jwt_identity()
    try:
        p = project_service.get_project_by_id(project_id, user_id)
        data = project_schema.dump(p)
        data['materials_ids'] = [m.id for m in p.materials if not m.deleted]
        data['habits_ids'] = [h.id for h in p.habits if not h.deleted]
        # Podrías también incluir tasks:
        data['task_ids'] = [t.id for t in p.tasks if not t.deleted]
        return data, 200
    except Exception as e:
        return {"error": str(e)}, 404

@project_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_proj = project_service.create_project(data, user_id)
        return project_schema.dump(new_proj), 201
    except Exception as e:
        return {"error": str(e)}, 400

@project_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = project_service.update_project(project_id, data, user_id)
        result = project_schema.dump(updated)
        result['materials_ids'] = [m.id for m in updated.materials if not m.deleted]
        result['habits_ids'] = [h.id for h in updated.habits if not h.deleted]
        return result, 200
    except Exception as e:
        return {"error": str(e)}, 404

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    try:
        project_service.delete_project(project_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@project_bp.route('/<int:project_id>/progress', methods=['GET'])
@jwt_required()
def get_project_progress(project_id):
    """
    Endpoint que retorna un resumen del progreso global del proyecto:
    - Porcentaje de tareas completadas
    - Energía total
    - XP total (si aplica)
    etc.
    """
    user_id = get_jwt_identity()
    try:
        progress = project_service.get_project_progress(project_id, user_id)
        return jsonify(progress), 200
    except Exception as e:
        return {"error": str(e)}, 400
    
@project_bp.route('/<int:project_id>/complete', methods=['POST'])
@jwt_required()
def complete_project(project_id):
    user_id = get_jwt_identity()
    try:
        p = project_service.complete_project(project_id, user_id)
        return {"message": f"Proyecto '{p.name}' completado."}, 200
    except Exception as e:
        return {"error": str(e)}, 404

# {
#   "info": {
#     "name": "Iter Polaris - API Tests",
#     "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
#   },
#   "item": [
#     {
#       "name": "Auth",
#       "item": []
#     },
#     {
#       "name": "Users",
#       "item": []
#     },
#     {
#       "name": "Zones",
#       "item": []
#     },
#     {
#       "name": "Projects",
#       "item": []
#     },
#     {
#       "name": "Tasks",
#       "item": []
#     },
#     {
#       "name": "Habits",
#       "item": []
#     },
#     {
#       "name": "Journals",
#       "item": []
#     },
#     {
#       "name": "Achievements",
#       "item": []
#     },
#     {
#       "name": "Effects",
#       "item": []
#     },
#     {
#       "name": "Store",
#       "item": []
#     }
#   ]
# }
