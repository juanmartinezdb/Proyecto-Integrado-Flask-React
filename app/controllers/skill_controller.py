from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required,  get_jwt_identity
from app.services.skill_service import SkillService
from app.schemas.skill_schema import SkillSchema

skill_bp = Blueprint('skill_bp', __name__)
skill_service = SkillService()

skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)

@skill_bp.route('', methods=['GET'])
@jwt_required()
def get_all_skills():
    """
    GET /skills
    Filtros:
      - type (mental, physical, etc.)
      - min_level, max_level
      - min_cost, max_cost
    Ejemplo: /skills?type=physical&min_level=5
    """
    query_params = request.args
    s_type = query_params.get('type')
    min_level = query_params.get('min_level')
    max_level = query_params.get('max_level')
    min_cost = query_params.get('min_cost')
    max_cost = query_params.get('max_cost')

    items = skill_service.get_skills_filtered(s_type, min_level, max_level, min_cost, max_cost)
    return jsonify(skills_schema.dump(items)), 200

@skill_bp.route('/<int:skill_id>', methods=['GET'])
@jwt_required()
def get_skill_by_id(skill_id):
    try:
        sk = skill_service.get_skill_by_id(skill_id)
        return skill_schema.dump(sk), 200
    except Exception as e:
        return {"error": str(e)}, 404

@skill_bp.route('', methods=['POST'])
@jwt_required()
def create_skill():
    data = request.get_json()
    try:
        new_sk = skill_service.create_skill(data)
        return skill_schema.dump(new_sk), 201
    except Exception as e:
        return {"error": str(e)}, 400

@skill_bp.route('/<int:skill_id>', methods=['PUT'])
@jwt_required()
def update_skill(skill_id):
    data = request.get_json()
    try:
        updated = skill_service.update_skill(skill_id, data)
        return skill_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@skill_bp.route('/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_skill(skill_id):
    try:
        skill_service.delete_skill(skill_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@skill_bp.route('/use/<int:skill_id>', methods=['POST'])
@jwt_required()
def use_skill(skill_id):
    user_id = get_jwt_identity()
    try:
        result = skill_service.use_skill(user_id, skill_id)
        return jsonify(result), 200
    except Exception as e:
        return {"error": str(e)}, 400