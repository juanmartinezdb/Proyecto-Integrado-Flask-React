from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.gear_service import GearService
from app.schemas.gear_schema import GearSchema

gear_bp = Blueprint('gear_bp', __name__)
gear_service = GearService()

gear_schema = GearSchema()
gears_schema = GearSchema(many=True)

@gear_bp.route('', methods=['GET'])
@jwt_required()
def get_all_gears():
    """
    GET /gears
    Soporta filtros:
      - type (mental, physical, etc.)
      - consumable (true/false)
      - min_cost, max_cost
      - rarity
    Ejemplo: GET /gears?type=mental&consumable=true
    """
    query_params = request.args
    gear_type = query_params.get('type')
    consumable = query_params.get('consumable')
    min_cost = query_params.get('min_cost')
    max_cost = query_params.get('max_cost')
    rarity = query_params.get('rarity')

    items = gear_service.get_gears_with_filters(
        gear_type=gear_type,
        consumable=consumable,
        min_cost=min_cost,
        max_cost=max_cost,
        rarity=rarity
    )
    return jsonify(gears_schema.dump(items)), 200

@gear_bp.route('/<int:gear_id>', methods=['GET'])
@jwt_required()
def get_gear_by_id(gear_id):
    try:
        gear = gear_service.get_gear_by_id(gear_id)
        return gear_schema.dump(gear), 200
    except Exception as e:
        return {"error": str(e)}, 404

@gear_bp.route('', methods=['POST'])
@jwt_required()
def create_gear():
    data = request.get_json()
    try:
        new_gear = gear_service.create_gear(data)
        return gear_schema.dump(new_gear), 201
    except Exception as e:
        return {"error": str(e)}, 400

@gear_bp.route('/<int:gear_id>', methods=['PUT'])
@jwt_required()
def update_gear(gear_id):
    data = request.get_json()
    try:
        updated = gear_service.update_gear(gear_id, data)
        return gear_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@gear_bp.route('/<int:gear_id>', methods=['DELETE'])
@jwt_required()
def delete_gear(gear_id):
    try:
        gear_service.delete_gear(gear_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
