from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.agenda_service import AgendaService

agenda_bp = Blueprint('agenda_bp', __name__)
agenda_service = AgendaService()

@agenda_bp.route('/view', methods=['GET'])
@jwt_required()
def get_agenda_view():
    """
    GET /agenda/view
    Devuelve una vista combinada de tareas, hábitos y proyectos en un intervalo de tiempo.

    Query params:
      - period = "daily"|"weekly"|"monthly" (por defecto "daily")
      - date = "YYYY-MM-DD"  (fecha de referencia; si se omite, se usa hoy)
      - zone_id = filtra por zona (opcional)
      - types = lista separada por comas "task,habit,project" 
                (por defecto 'task,habit,project', es decir, todo)
      - export = "ics" (opcional) => si se desea exportar en ICS

    Ejemplo:
      /agenda/view?period=weekly&date=2023-07-10&zone_id=3&types=task,habit

    Si "export=ics", la respuesta se devuelve como un archivo ICS generable en un calendar.
    """
    user_id = get_jwt_identity()
    period = request.args.get('period', 'daily')
    ref_date_str = request.args.get('date')  # YYYY-MM-DD
    zone_id = request.args.get('zone_id')
    types = request.args.get('types', 'task,habit,project')
    export_format = request.args.get('export')

    try:
        agenda_data = agenda_service.get_agenda_data(
            user_id=user_id,
            period=period,
            ref_date_str=ref_date_str,
            zone_id=zone_id,
            included_types=types.split(',')
        )

        if export_format == 'ics':
            # Generar contenido ICS:
            ics_str = agenda_service.export_agenda_to_ics(agenda_data)
            response = make_response(ics_str)
            response.headers['Content-Disposition'] = 'attachment; filename=agenda.ics'
            response.headers['Content-Type'] = 'text/calendar; charset=utf-8'
            return response

        # Devolver JSON por defecto
        return jsonify(agenda_data), 200

    except Exception as e:
        return {"error": str(e)}, 400
