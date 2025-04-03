from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.store_service import StoreService

store_bp = Blueprint('store_bp', __name__)
store_service = StoreService()

@store_bp.route('/skills', methods=['GET'])
@jwt_required()
def list_store_skills():
    """
    Lista las skills disponibles en la tienda (que el usuario aún no posee).
    """
    query_params = request.args
    user_id = int(get_jwt_identity())
    try:
        items = store_service.list_skills_in_store(user_id, query_params)
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@store_bp.route('/items', methods=['GET'])
@jwt_required()
def list_store_items():
    """
    Lista los ítems (Gear) disponibles en la tienda (que el usuario aún no posee).
    """
    query_params = request.args
    user_id = int(get_jwt_identity())
    try:
        items = store_service.list_gear_in_store(user_id, query_params)
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@store_bp.route('/skills/purchase', methods=['POST'])
@jwt_required()
def purchase_skill():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    skill_id = data.get('skill_id')
    zone_id = data.get('zone_id')  # Opcional, solo si es skill de zona

    try:
        result = store_service.buy_skill(user_id, skill_id, zone_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@store_bp.route('/items/purchase', methods=['POST'])
@jwt_required()
def purchase_item():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    gear_id = data.get('gear_id')

    try:
        result = store_service.buy_item(user_id, gear_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
