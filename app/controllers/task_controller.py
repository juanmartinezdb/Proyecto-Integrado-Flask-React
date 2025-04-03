from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.task_service import TaskService
from app.schemas.task_schema import TaskSchema

task_bp = Blueprint('task_bp', __name__)
task_service = TaskService()

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

@task_bp.route('', methods=['GET'])
@jwt_required()
def get_all_tasks():
    """
    GET /tasks
    Parámetros de query posibles:
      - status=PENDING|COMPLETED...
      - priority=HIGH|MEDIUM|LOW
      - cycle=DAILY|WEEKLY|NONE
      - start_date=YYYY-MM-DD
      - end_date=YYYY-MM-DD
      - zone_id=...
      - project_id=...
      - energy_type=positive|negative  (NUEVO)
      - page=1, limit=10               (NUEVO)
    """
    user_id = get_jwt_identity()
    query_params = request.args

    status = query_params.get('status')
    priority = query_params.get('priority')
    cycle = query_params.get('cycle')
    project_id = query_params.get('project_id')
    zone_id = query_params.get('zone_id')
    start_date = query_params.get('start_date')
    end_date = query_params.get('end_date')

    # NUEVO
    energy_type = query_params.get('energy_type')  # "positive" o "negative"
    page = query_params.get('page')
    limit = query_params.get('limit')

    tasks, total = task_service.get_tasks_with_filters(
        user_id=user_id,
        status=status,
        priority=priority,
        cycle=cycle,
        project_id=project_id,
        zone_id=zone_id,
        start_date=start_date,
        end_date=end_date,
        energy_type=energy_type,   # Param filtrado de energía
        page=page,                 # Para paginación
        limit=limit
    )

    # Estructura de respuesta que incluya datos y metadatos de paginación
    response = {
        "items": tasks_schema.dump(tasks),  # la lista de tareas
        "total": total,                     # total de tareas que cumplen el filtro
    }

    # si se enviaron parámetros de paginación, devolvemos la info
    if page and limit:
        response["page"] = int(page)
        response["limit"] = int(limit)

    return jsonify(response), 200


@task_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_by_id(task_id):
    user_id = get_jwt_identity()
    try:
        t = task_service.get_task_by_id(task_id, user_id)
        return task_schema.dump(t), 200
    except Exception as e:
        return {"error": str(e)}, 404


@task_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_task = task_service.create_task(data, user_id)
        return task_schema.dump(new_task), 201
    except Exception as e:
        return {"error": str(e)}, 400


@task_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = task_service.update_task(task_id, data, user_id)
        return task_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404


@task_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    try:
        task_service.delete_task(task_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404


@task_bp.route('/<int:task_id>/complete', methods=['POST'])
@jwt_required()
def complete_task(task_id):
    """
    Marca la tarea como COMPLETED y opcionalmente actualiza XP/energy del usuario.
    """
    user_id = get_jwt_identity()
    try:
        t = task_service.complete_task(task_id, user_id)
        return {"message": f"Tarea '{t.name}' completada."}, 200
    except Exception as e:
        return {"error": str(e)}, 404


@task_bp.route('/overdue', methods=['GET'])
@jwt_required()
def get_overdue_tasks():
    """
    Devuelve las tareas vencidas (overdue) según la fecha actual.
    """
    user_id = get_jwt_identity()
    tasks = task_service.get_overdue_tasks(user_id)
    return jsonify(tasks_schema.dump(tasks)), 200

@task_bp.route('/overdue/mark', methods=['POST'])
@jwt_required()
def mark_overdue_tasks():
    """
    POST /tasks/overdue/mark
    Marca las tareas atrasadas como 'VENCIDAS' y dispara el evento 
    TASK_OVERDUE_CHECK para logros globales.
    """
    user_id = get_jwt_identity()
    updated_tasks = task_service.mark_overdue_tasks(user_id)
    return {
        "message": "Tareas marcadas como vencidas",
        "count": len(updated_tasks)
    }, 200