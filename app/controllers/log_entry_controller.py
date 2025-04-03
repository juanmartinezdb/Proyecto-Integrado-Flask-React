from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.log_entry_service import LogEntryService
from app.schemas.log_entry_schema import LogEntrySchema

log_entry_bp = Blueprint('log_entry_bp', __name__)
entry_service = LogEntryService()

entry_schema = LogEntrySchema()
entries_schema = LogEntrySchema(many=True)

@log_entry_bp.route('', methods=['GET'])
@jwt_required()
def get_all_log_entries():
    """
    GET /log-entries
    Soporta filtros por:
      - type (TASK, HABIT, JOURNAL_ENTRY, etc.)
      - zone_id
      - from_date y to_date (rango de fechas en end_timestamp)
    Ejemplo: /log-entries?type=TASK&zone_id=2&from_date=2023-06-01&to_date=2023-06-30
    """
    user_id = get_jwt_identity()
    query_params = request.args
    log_type = query_params.get('type')
    zone_id = query_params.get('zone_id')
    from_date = query_params.get('from_date')
    to_date = query_params.get('to_date')

    items = entry_service.get_log_entries_filtered(user_id, log_type, zone_id, from_date, to_date)
    return jsonify(entries_schema.dump(items)), 200

@log_entry_bp.route('', methods=['POST'])
@jwt_required()
def create_log_entry():
    """
    Crea un log entry nuevo. Ejemplo Body:
      {
        "challenge_level": "NORMAL",
        "type": "TASK",
        "item_id": 12,
        "end_timestamp": "2023-06-30",
        "energy": 10,
        "zone_id": 2
      }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_entry = entry_service.create_log_entry(data, user_id)
        return entry_schema.dump(new_entry), 201
    except Exception as e:
        return {"error": str(e)}, 400

@log_entry_bp.route('/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_log_entry(log_id):
    """
    Borrado lógico de un log entry.
    """
    user_id = get_jwt_identity()
    try:
        entry_service.delete_log_entry(log_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@log_entry_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_log_summary():
    """
    GET /log-entries/summary
    Permite obtener un resumen diario o semanal de energía total, etc.
    Query params:
      - range = 'daily' o 'weekly'
      - days_back = número de días hacia atrás (por defecto 7)
    Ejemplo:
      GET /log-entries/summary?range=daily&days_back=7
    """
    user_id = get_jwt_identity()
    range_type = request.args.get('range', 'daily')  # 'daily' o 'weekly'
    days_back = request.args.get('days_back', '7')

    try:
        summary = entry_service.get_log_summary(user_id, range_type, int(days_back))
        return jsonify(summary), 200
    except Exception as e:
        return {"error": str(e)}, 400
