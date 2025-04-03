# app/controllers/achievements_controller.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.global_achievement_service import GlobalAchievementService
from app.services.user_global_achievement_service import UserGlobalAchievementService
from app.schemas.global_achievement_schema import GlobalAchievementSchema
from app.schemas.user_global_achievement_schema import UserGlobalAchievementSchema

achievements_bp = Blueprint('achievements_bp', __name__)

global_ach_service = GlobalAchievementService()
user_ach_service = UserGlobalAchievementService()

# ----------------------------------------------------------------------
#                   GLOBAL ACHIEVEMENT CRUD
# ----------------------------------------------------------------------

@achievements_bp.route('/global', methods=['GET'])
@jwt_required()
def list_global_achievements():
    """
    GET /achievements/global
    Retorna la lista de logros globales (no borrados).
    """
    items = global_ach_service.list_global_achievements(only_active=True)
    schema = GlobalAchievementSchema(many=True)
    return jsonify(schema.dump(items)), 200

@achievements_bp.route('/global/<int:ach_id>', methods=['GET'])
@jwt_required()
def get_global_achievement(ach_id):
    """
    GET /achievements/global/<ach_id>
    Retorna el detalle de un logro global específico.
    """
    ach = global_ach_service.get_by_id(ach_id)
    if not ach:
        return {"error": "Logro global no encontrado"}, 404
    schema = GlobalAchievementSchema()
    return schema.dump(ach), 200

@achievements_bp.route('/global', methods=['POST'])
@jwt_required()
def create_global_achievement():
    """
    POST /achievements/global
    Crea un nuevo logro global.
    Body JSON: { name, description, condition_type, threshold, honorific_title, is_surprise }
    """
    data = request.get_json() or {}
    try:
        new_ach = global_ach_service.create_global_achievement(data)
        return GlobalAchievementSchema().dump(new_ach), 201
    except Exception as e:
        return {"error": str(e)}, 400

@achievements_bp.route('/global/<int:ach_id>', methods=['PUT'])
@jwt_required()
def update_global_achievement(ach_id):
    """
    PUT /achievements/global/<ach_id>
    Actualiza un logro global existente.
    """
    data = request.get_json() or {}
    try:
        updated = global_ach_service.update_global_achievement(ach_id, data)
        return GlobalAchievementSchema().dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 400

@achievements_bp.route('/global/<int:ach_id>', methods=['DELETE'])
@jwt_required()
def delete_global_achievement(ach_id):
    """
    DELETE /achievements/global/<ach_id>
    Borrado lógico del logro global.
    """
    try:
        global_ach_service.delete_global_achievement(ach_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 400

# ----------------------------------------------------------------------
#                  USER ACHIEVEMENTS
# ----------------------------------------------------------------------

@achievements_bp.route('/user', methods=['GET'])
@jwt_required()
def list_user_achievements():
    """
    GET /achievements/user
    Retorna la lista de logros que ha desbloqueado el usuario.
    """
    user_id = get_jwt_identity()
    user_achs = user_ach_service.get_user_achievements(user_id)
    schema = UserGlobalAchievementSchema(many=True)
    return jsonify(schema.dump(user_achs)), 200

@achievements_bp.route('/user/<int:global_ach_id>', methods=['GET'])
@jwt_required()
def get_user_achievement(global_ach_id):
    """
    GET /achievements/user/<global_ach_id>
    Verifica si el usuario tiene este logro (y retorna su detalle si es el caso).
    """
    user_id = get_jwt_identity()
    record = user_ach_service.get_user_achievement(user_id, global_ach_id)
    if not record:
        return jsonify({"has_achievement": False}), 200

    # Si sí lo tiene, devolvemos info
    schema = UserGlobalAchievementSchema()
    data = schema.dump(record)
    data["has_achievement"] = True
    return jsonify(data), 200
