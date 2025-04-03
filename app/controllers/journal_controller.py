from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.journal_service import JournalService
from app.schemas.journal_schema import JournalSchema

journal_bp = Blueprint('journal_bp', __name__)
journal_service = JournalService()

journal_schema = JournalSchema()
journals_schema = JournalSchema(many=True)

@journal_bp.route('', methods=['GET'])
@jwt_required()
def get_all_journals():
    """
    Lista los diarios del usuario con posibilidad de filtrar por rango de fechas (fecha de creación)
    o tipo. Query params:
      from_date, to_date, type
    """
    user_id = get_jwt_identity()
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    j_type = request.args.get('type')  # e.g. 'personal', 'work', etc.
    items = journal_service.get_all_journals_filtered(user_id, from_date, to_date, j_type)

    # Añadimos en la respuesta la lista de entries_ids si deseas
    result = []
    for j in items:
        data = journal_schema.dump(j)
        data['entries_ids'] = [e.id for e in j.entries if not e.deleted]
        result.append(data)
    return jsonify(result), 200

@journal_bp.route('/today', methods=['GET'])
@jwt_required()
def get_journal_today():
    """
    Devuelve (o crea) el diario de hoy, si tu lógica lo contempla.
    """
    user_id = get_jwt_identity()
    try:
        j = journal_service.get_or_create_journal_today(user_id)
        data = journal_schema.dump(j)
        data['entries_ids'] = [e.id for e in j.entries if not e.deleted]
        return data, 200
    except Exception as e:
        return {"error": str(e)}, 400

@journal_bp.route('/<int:journal_id>', methods=['GET'])
@jwt_required()
def get_journal_by_id(journal_id):
    user_id = get_jwt_identity()
    try:
        j = journal_service.get_journal_by_id(journal_id, user_id)
        data = journal_schema.dump(j)
        data['entries_ids'] = [e.id for e in j.entries if not e.deleted]
        return data, 200
    except Exception as e:
        return {"error": str(e)}, 404

@journal_bp.route('', methods=['POST'])
@jwt_required()
def create_journal():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_j = journal_service.create_journal(data, user_id)
        return journal_schema.dump(new_j), 201
    except Exception as e:
        return {"error": str(e)}, 400

@journal_bp.route('/<int:journal_id>', methods=['PUT'])
@jwt_required()
def update_journal(journal_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = journal_service.update_journal(journal_id, data, user_id)
        return journal_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@journal_bp.route('/<int:journal_id>', methods=['DELETE'])
@jwt_required()
def delete_journal(journal_id):
    user_id = get_jwt_identity()
    try:
        journal_service.delete_journal(journal_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@journal_bp.route('/<int:journal_id>/stats', methods=['GET'])
@jwt_required()
def get_journal_stats(journal_id):
    """
    Ejemplo para obtener estadísticas como promedio de puntos diarios o evolución de la racha.
    """
    user_id = get_jwt_identity()
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    try:
        stats = journal_service.get_journal_stats(journal_id, user_id, from_date, to_date)
        return jsonify(stats), 200
    except Exception as e:
        return {"error": str(e)}, 400
