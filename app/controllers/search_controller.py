from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.search_service import SearchService

search_bp = Blueprint('search_bp', __name__)
search_service = SearchService()

@search_bp.route('', methods=['GET'])
@jwt_required()
def global_search():
    """
    GET /search
    Permite buscar términos en distintas entidades: Task, Habit, Project, Material, etc.
    Query Params:
      q: string a buscar
      types: lista separada por comas (task,habit,project,material, etc.)
             por defecto, todos: 'task,habit,project,material'
      zone_id: filtra por zona si aplica (ej: tasks en un proyecto que pertenezca a esa zona,
               habits con zone_id = zone_id, etc.)
    Ejemplo:
      GET /search?q=estudio&types=task,habit&zone_id=3
    """
    user_id = get_jwt_identity()
    query = request.args.get('q', '')
    type_param = request.args.get('types', 'task,habit,project,material')
    zone_id = request.args.get('zone_id')

    included_types = type_param.split(',')

    try:
        results = search_service.global_search(user_id, query, included_types, zone_id)
        return jsonify(results), 200
    except Exception as e:
        return {"error": str(e)}, 400
