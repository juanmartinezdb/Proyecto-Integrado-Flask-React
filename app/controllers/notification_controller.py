from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationSchema

notification_bp = Blueprint('notification_bp', __name__)
notification_service = NotificationService()

notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)

@notification_bp.route('', methods=['GET'])
@jwt_required()
def get_user_notifications():
    """
    GET /notifications
    Soporta filtros por tipo (reminder, achievement, alert, etc.) mediante query param ?type=XXX
    Ej: GET /notifications?type=reminder
    """
    user_id = get_jwt_identity()
    notif_type = request.args.get('type')  # e.g. 'reminder'
    items = notification_service.get_user_notifications_filtered(user_id, notif_type)
    return jsonify(notifications_schema.dump(items)), 200

@notification_bp.route('', methods=['POST'])
@jwt_required()
def create_notification():
    """
    Crea una nueva notificación para el usuario actual.
    Body JSON:
      {
        "message": "...",
        "type": "reminder" | "achievement" | "alert" | ...
      }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_notif = notification_service.create_notification(data, user_id)
        return notification_schema.dump(new_notif), 201
    except Exception as e:
        return {"error": str(e)}, 400

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """
    Marca como leída una notificación específica.
    """
    user_id = get_jwt_identity()
    try:
        notification_service.mark_as_read(notification_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """
    Marca TODAS las notificaciones del usuario como leídas.
    PUT /notifications/read-all
    """
    user_id = get_jwt_identity()
    try:
        count = notification_service.mark_all_as_read(user_id)
        return {"message": f"{count} notificaciones marcadas como leídas."}, 200
    except Exception as e:
        return {"error": str(e)}, 400

@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """
    Borrado lógico de una notificación específica.
    """
    user_id = get_jwt_identity()
    try:
        notification_service.delete_notification(notification_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
