from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.stats_service import StatsService

stats_bp = Blueprint('stats_bp', __name__)
stats_service = StatsService()

@stats_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_stats():
    """
    GET /stats/user
    Devuelve estadísticas del usuario, incluida la barra de energía actualizada.
    Query param:
      refresh_energy = true|false (indica si recalcular o no)
    """
    user_id = get_jwt_identity()
    refresh_energy = request.args.get('refresh_energy', 'false').lower() == 'true'
    try:
        if refresh_energy:
            stats_service.update_user_energy(user_id)
        stats = stats_service.get_user_stats(user_id)
        return jsonify(stats), 200
    except Exception as e:
        return {"error": str(e)}, 400

@stats_bp.route('/zone/<int:zone_id>', methods=['GET'])
@jwt_required()
def get_zone_stats(zone_id):
    """
    GET /stats/zone/<zone_id>
    Devuelve estadísticas de la zona, con opción de refresh de energía.
    ?refresh_energy=true
    """
    user_id = get_jwt_identity()
    refresh_energy = request.args.get('refresh_energy', 'false').lower() == 'true'
    try:
        if refresh_energy:
            stats_service.update_zone_energy(zone_id, user_id)
        stats = stats_service.get_zone_stats(zone_id, user_id)
        return jsonify(stats), 200
    except Exception as e:
        return {"error": str(e)}, 400

@stats_bp.route('/history', methods=['GET'])
@jwt_required()
def get_stats_history():
    """
    GET /stats/history
    Endpoint opcional para obtener resúmenes históricos, 
    p.e. energía o xp por día/semana.
    Query param:
      type = 'energy'|'xp'|'level'
      days_back = 7 (default)
    """
    user_id = get_jwt_identity()
    stats_type = request.args.get('type', 'energy')
    days_back = int(request.args.get('days_back', '7'))

    try:
        data = stats_service.get_stats_history(user_id, stats_type, days_back)
        return jsonify(data), 200
    except Exception as e:
        return {"error": str(e)}, 400
