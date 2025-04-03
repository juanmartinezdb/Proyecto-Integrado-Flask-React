from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.inventory_service import InventoryService
from app.schemas.inventory_item_schema import InventoryItemSchema

inventory_bp = Blueprint('inventory_bp', __name__)
inventory_service = InventoryService()

item_schema = InventoryItemSchema()
items_schema = InventoryItemSchema(many=True)

@inventory_bp.route('', methods=['GET'])
@jwt_required()
def get_user_inventory():
    """
    GET /inventory
    Soporta filtros por:
      - gear_type (mental, physical, etc.)
      - min_uses, max_uses
      - acquired_from, acquired_to (rango de fechas de adquisición)
    Ejemplo: /inventory?gear_type=mental&min_uses=1&acquired_from=2023-06-01
    """
    user_id = get_jwt_identity()
    query_params = request.args

    gear_type = query_params.get('gear_type')
    min_uses = query_params.get('min_uses')
    max_uses = query_params.get('max_uses')
    acquired_from = query_params.get('acquired_from')
    acquired_to = query_params.get('acquired_to')

    items = inventory_service.get_user_inventory_filtered(
        user_id, gear_type, min_uses, max_uses, acquired_from, acquired_to
    )
    return jsonify(items_schema.dump(items)), 200

@inventory_bp.route('/<int:item_id>', methods=['GET'])
@jwt_required()
def get_item_by_id(item_id):
    user_id = get_jwt_identity()
    try:
        item = inventory_service.get_item_by_id(item_id, user_id)
        return item_schema.dump(item), 200
    except Exception as e:
        return {"error": str(e)}, 404

@inventory_bp.route('', methods=['POST'])
@jwt_required()
def add_gear_to_user():
    """
    Crea un InventoryItem para el usuario.
    Body JSON:
      {
        "gear_id": ...,
        "remaining_uses": ...
      }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_item = inventory_service.add_gear_to_user(data, user_id)
        return item_schema.dump(new_item), 201
    except Exception as e:
        return {"error": str(e)}, 400

@inventory_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_inventory_item(item_id):
    """
    Permite actualizar remaining_uses y/o alguna otra información 
    de un item en el inventario.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = inventory_service.update_inventory_item(item_id, data, user_id)
        return item_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@inventory_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory_item(item_id):
    """
    Borrado lógico de un item de inventario.
    """
    user_id = get_jwt_identity()
    try:
        inventory_service.delete_inventory_item(item_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
    
@inventory_bp.route('/<int:item_id>/use', methods=['POST'])
@jwt_required()
def use_inventory_item(item_id):
    """
    Llama a inventory_service.use_item() para 'gastar' un uso del item.
    """
    user_id = get_jwt_identity()
    try:
        result = inventory_service.use_item(item_id, user_id)
        return jsonify(result), 200
    except Exception as e:
        return {"error": str(e)}, 400