from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.habit_service import HabitService
from app.schemas.habit_schema import HabitSchema

habit_bp = Blueprint('habit_bp', __name__)
habit_service = HabitService()

habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)

@habit_bp.route('', methods=['GET'])
@jwt_required()
def get_all_habits():
    """
    GET /habits
    Filtros disponibles:
      - active=true|false
      - frequency=DAILY|WEEKLY|NONE
      - min_energy, max_energy (rango)
      - energy_type=positive|negative (NUEVO)
      - page, limit (paginación)
    """
    user_id = get_jwt_identity()
    query_params = request.args

    active = query_params.get('active')
    frequency = query_params.get('frequency')
    min_energy = query_params.get('min_energy')
    max_energy = query_params.get('max_energy')
    start_date = query_params.get('start_date')
    end_date = query_params.get('end_date')
    energy_type = query_params.get('energy_type')
    page = query_params.get('page')
    limit = query_params.get('limit')

    habits, total = habit_service.get_habits_with_filters(
        user_id=user_id,
        active=active,
        frequency=frequency,
        min_energy=min_energy,
        max_energy=max_energy,
        start_date=start_date,
        end_date=end_date,
        energy_type=energy_type,
        page=page,
        limit=limit
    )

    response = {
        "items": habits_schema.dump(habits),
        "total": total
    }

    if page and limit:
        response["page"] = int(page)
        response["limit"] = int(limit)

    return jsonify(response), 200

@habit_bp.route('/<int:habit_id>', methods=['GET'])
@jwt_required()
def get_habit_by_id(habit_id):
    user_id = get_jwt_identity()
    try:
        h = habit_service.get_habit_by_id(habit_id, user_id)
        return habit_schema.dump(h), 200
    except Exception as e:
        return {"error": str(e)}, 404

@habit_bp.route('', methods=['POST'])
@jwt_required()
def create_habit():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_h = habit_service.create_habit(data, user_id)
        return habit_schema.dump(new_h), 201
    except Exception as e:
        return {"error": str(e)}, 400

@habit_bp.route('/<int:habit_id>', methods=['PUT'])
@jwt_required()
def update_habit(habit_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = habit_service.update_habit(habit_id, data, user_id)
        return habit_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@habit_bp.route('/<int:habit_id>', methods=['DELETE'])
@jwt_required()
def delete_habit(habit_id):
    user_id = get_jwt_identity()
    try:
        habit_service.delete_habit(habit_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@habit_bp.route('/<int:habit_id>/complete', methods=['POST'])
@jwt_required()
def complete_habit(habit_id):
    """
    Marca un hábito como completado, actualizando la racha (streak) y total_check.
    """
    user_id = get_jwt_identity()
    try:
        completed = habit_service.complete_habit(habit_id, user_id)
        return {"message": f"Hábito '{completed.name}' completado.", 
                "streak": completed.streak}, 200
    except Exception as e:
        return {"error": str(e)}, 404

@habit_bp.route('/<int:habit_id>/streak', methods=['GET'])
@jwt_required()
def get_habit_streak(habit_id):
    """
    Devuelve la racha actual (streak) y el total_check de un hábito.
    """
    user_id = get_jwt_identity()
    try:
        streak_info = habit_service.get_habit_streak(habit_id, user_id)
        return jsonify(streak_info), 200
    except Exception as e:
        return {"error": str(e)}, 404

@habit_bp.route('/<int:habit_id>/stats', methods=['GET'])
@jwt_required()
def get_habit_stats(habit_id):
    """
    Ejemplo: obtener número de veces completado en un período, etc.
    Query Params (opcionales):
      from_date y to_date: rangos para contar cuántas veces se marcó en ese período.
    """
    user_id = get_jwt_identity()
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    try:
        stats = habit_service.get_habit_stats(habit_id, user_id, from_date, to_date)
        return jsonify(stats), 200
    except Exception as e:
        return {"error": str(e)}, 400
