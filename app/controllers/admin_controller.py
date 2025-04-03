from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.admin_service import AdminService
from app.schemas.user_schema import UserSchema
from app.schemas.admin_log_schema import AdminLogSchema
from app.schemas.incident_schema import IncidentSchema

admin_bp = Blueprint('admin_bp', __name__)
admin_service = AdminService()

user_schema = UserSchema()
users_schema = UserSchema(many=True)

log_schema = AdminLogSchema()
logs_schema = AdminLogSchema(many=True)

incident_schema = IncidentSchema()
incidents_schema = IncidentSchema(many=True)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_all_users():
    """
    GET /admin/users
    Lista todos los usuarios no borrados.
    """
    # Aquí podrías verificar si el usuario actual es ADMIN
    # ...
    users = admin_service.list_all_users()
    return jsonify(users_schema.dump(users)), 200

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    """
    PUT /admin/users/<id>/role
    Body JSON: { "role": "ADMIN"|"USER" }
    Actualiza el rol del usuario.
    """
    data = request.get_json()
    new_role = data.get("role")
    if not new_role:
        return {"error": "Falta el campo 'role' (ADMIN|USER)"}, 400

    try:
        updated_user = admin_service.update_user_role(user_id, new_role)
        return user_schema.dump(updated_user), 200
    except Exception as e:
        return {"error": str(e)}, 400

@admin_bp.route('/logs', methods=['GET'])
@jwt_required()
def list_admin_logs():
    """
    GET /admin/logs?level=INFO|WARN|ERROR
    Lista los logs administrativos, opcional filtra por nivel.
    """
    level = request.args.get('level')
    logs = admin_service.list_admin_logs(level_filter=level)
    return jsonify(logs_schema.dump(logs)), 200

@admin_bp.route('/logs/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_admin_log(log_id):
    """
    DELETE /admin/logs/<id>
    Soft-delete de un log de admin.
    """
    try:
        admin_service.delete_admin_log(log_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@admin_bp.route('/incidents', methods=['GET'])
@jwt_required()
def list_incidents():
    """
    GET /admin/incidents?status=OPEN|CLOSED
    """
    status = request.args.get('status')
    incs = admin_service.list_incidents(status)
    return jsonify(incidents_schema.dump(incs)), 200

@admin_bp.route('/incidents', methods=['POST'])
@jwt_required()
def create_incident():
    """
    POST /admin/incidents
    Body: { "type": "...", "description": "..." }
    """
    data = request.get_json()
    inc_type = data.get('type')
    desc = data.get('description')
    if not inc_type or not desc:
        return {"error": "Se requieren 'type' y 'description'."}, 400
    try:
        new_inc = admin_service.create_incident(inc_type, desc)
        return incident_schema.dump(new_inc), 201
    except Exception as e:
        return {"error": str(e)}, 400

@admin_bp.route('/incidents/<int:incident_id>/close', methods=['PUT'])
@jwt_required()
def close_incident(incident_id):
    """
    PUT /admin/incidents/<id>/close
    Cambia status a CLOSED.
    """
    try:
        inc = admin_service.close_incident(incident_id)
        return incident_schema.dump(inc), 200
    except Exception as e:
        return {"error": str(e)}, 400

@admin_bp.route('/reset', methods=['POST'])
@jwt_required()
def reset_global_data():
    """
    POST /admin/reset
    Herramienta de reset global de datos (soft delete masivo).
    """
    try:
        result = admin_service.reset_global_data()
        return result, 200
    except Exception as e:
        return {"error": str(e)}, 400

@admin_bp.route('/report/csv', methods=['GET'])
@jwt_required()
def generate_report_csv():
    """
    GET /admin/report/csv
    Devuelve un archivo CSV con un reporte de usuarios (u otras métricas).
    """
    csv_content = admin_service.generate_report_csv()
    response = make_response(csv_content)
    response.headers["Content-Disposition"] = "attachment; filename=report.csv"
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    return response

@admin_bp.route('/report/pdf', methods=['GET'])
@jwt_required()
def generate_report_pdf():
    """
    GET /admin/report/pdf
    Retorna un "PDF" simulado (string) como ejemplo.
    En un proyecto real, generarías un binario PDF.
    """
    pdf_content = admin_service.generate_report_pdf()
    # Para una generación real con binarios:
    # response = make_response(pdf_bytes)
    # response.headers["Content-Disposition"] = "attachment; filename=report.pdf"
    # response.headers["Content-Type"] = "application/pdf"
    # return response
    return {"pdf_content_mock": pdf_content}
