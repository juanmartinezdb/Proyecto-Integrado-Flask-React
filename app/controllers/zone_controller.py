from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.zone_service import ZoneService
from app.schemas.zone_schema import ZoneSchema

zone_bp = Blueprint('zone_bp', __name__)
zone_service = ZoneService()

zone_schema = ZoneSchema()
zones_schema = ZoneSchema(many=True)

@zone_bp.route('', methods=['GET'])
@jwt_required()
def get_all_zones():
    """
    GET /zones
    Filtros posibles:
      - name (substring)
      - min_energy, max_energy
      - min_level, max_level
      - xp (rango)
    Ejemplo: /zones?name=Work&min_level=2
    """
    user_id = get_jwt_identity()
    query_params = request.args

    name_filter = query_params.get('name')
    min_energy = query_params.get('min_energy')
    max_energy = query_params.get('max_energy')
    min_level = query_params.get('min_level')
    max_level = query_params.get('max_level')
    min_xp = query_params.get('min_xp')
    max_xp = query_params.get('max_xp')

    items = zone_service.get_zones_with_filters(
        user_id=user_id,
        name=name_filter,
        min_energy=min_energy,
        max_energy=max_energy,
        min_level=min_level,
        max_level=max_level,
        min_xp=min_xp,
        max_xp=max_xp
    )
    return jsonify(zones_schema.dump(items)), 200

@zone_bp.route('/<int:zone_id>', methods=['GET'])
@jwt_required()
def get_zone_by_id(zone_id):
    user_id = get_jwt_identity()
    try:
        z = zone_service.get_zone_by_id(zone_id, user_id)
        return zone_schema.dump(z), 200
    except Exception as e:
        return {"error": str(e)}, 404

@zone_bp.route('', methods=['POST'])
@jwt_required()
def create_zone():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_z = zone_service.create_zone(data, user_id)
        return zone_schema.dump(new_z), 201
    except Exception as e:
        return {"error": str(e)}, 400

@zone_bp.route('/<int:zone_id>', methods=['PUT'])
@jwt_required()
def update_zone(zone_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = zone_service.update_zone(zone_id, data, user_id)
        return zone_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@zone_bp.route('/<int:zone_id>', methods=['DELETE'])
@jwt_required()
def delete_zone(zone_id):
    user_id = get_jwt_identity()
    try:
        zone_service.delete_zone(zone_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@zone_bp.route('/<int:zone_id>/stats', methods=['GET'])
@jwt_required()
def get_zone_stats(zone_id):
    """
    GET /zones/<zone_id>/stats
    Retorna info como energía, xp, level, etc.
    """
    user_id = get_jwt_identity()
    try:
        stats = zone_service.get_zone_stats(zone_id, user_id)
        return jsonify(stats), 200
    except Exception as e:
        return {"error": str(e)}, 400

@zone_bp.route('/<int:zone_id>/assign', methods=['POST'])
@jwt_required()
def assign_zone(zone_id):
    """
    Asigna o cambia la zona de un proyecto, tarea o hábito.
    Body:
      {
        "type": "project"|"task"|"habit",
        "item_id": 123
      }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    obj_type = data.get('type')
    item_id = data.get('item_id')
    try:
        zone_service.assign_zone(zone_id, user_id, obj_type, item_id)
        return {"message": f"Zona asignada correctamente al {obj_type} {item_id}"}, 200
    except Exception as e:
        return {"error": str(e)}, 400
