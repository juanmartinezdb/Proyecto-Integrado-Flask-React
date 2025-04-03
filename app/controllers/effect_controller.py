from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.effect_service import EffectService
from app.schemas.effect_schema import EffectSchema

effect_bp = Blueprint('effect_bp', __name__)
effect_service = EffectService()

effect_schema = EffectSchema()
effects_schema = EffectSchema(many=True)

@effect_bp.route('', methods=['GET'])
@jwt_required()
def get_all_effects():
    effects = effect_service.get_all_effects()
    return jsonify(effects_schema.dump(effects)), 200

@effect_bp.route('/<int:effect_id>', methods=['GET'])
@jwt_required()
def get_effect_by_id(effect_id):
    try:
        eff = effect_service.get_by_id(effect_id)
        return effect_schema.dump(eff), 200
    except Exception as e:
        return {"error": str(e)}, 404

@effect_bp.route('', methods=['POST'])
@jwt_required()
def create_effect():
    data = request.get_json()
    new_eff = effect_service.create_effect(data)
    return effect_schema.dump(new_eff), 201

@effect_bp.route('/<int:effect_id>', methods=['PUT'])
@jwt_required()
def update_effect(effect_id):
    data = request.get_json()
    try:
        updated = effect_service.update_effect(effect_id, data)
        return effect_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@effect_bp.route('/<int:effect_id>', methods=['DELETE'])
@jwt_required()
def delete_effect(effect_id):
    try:
        effect_service.delete_effect(effect_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
