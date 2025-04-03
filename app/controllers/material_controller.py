from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.material_service import MaterialService
from app.schemas.material_schema import MaterialSchema

material_bp = Blueprint('material_bp', __name__)
material_service = MaterialService()

material_schema = MaterialSchema()
materials_schema = MaterialSchema(many=True)

@material_bp.route('', methods=['GET'])
@jwt_required()
def get_all_materials():
    """
    Extensión para soportar filtros por:
      - type (documento, link, video, etc.)
      - query (palabra clave en nombre o description)
      - project_id (listar materiales de un proyecto específico)
      - user_id (implícito con get_jwt_identity)
    Ejemplo:
      GET /materials?type=video&query=angular
    """
    user_id = get_jwt_identity()
    mat_type = request.args.get('type')
    query = request.args.get('query')
    project_id = request.args.get('project_id')
    items = material_service.get_materials_with_filters(user_id, mat_type, query, project_id)
    return jsonify(materials_schema.dump(items)), 200

@material_bp.route('/<int:material_id>', methods=['GET'])
@jwt_required()
def get_material_by_id(material_id):
    user_id = get_jwt_identity()
    try:
        mat = material_service.get_material_by_id(material_id, user_id)
        return material_schema.dump(mat), 200
    except Exception as e:
        return {"error": str(e)}, 404

@material_bp.route('', methods=['POST'])
@jwt_required()
def create_material():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_mat = material_service.create_material(data, user_id)
        return material_schema.dump(new_mat), 201
    except Exception as e:
        return {"error": str(e)}, 400

@material_bp.route('/<int:material_id>', methods=['PUT'])
@jwt_required()
def update_material(material_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = material_service.update_material(material_id, data, user_id)
        return material_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@material_bp.route('/<int:material_id>', methods=['DELETE'])
@jwt_required()
def delete_material(material_id):
    user_id = get_jwt_identity()
    try:
        material_service.delete_material(material_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
