from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import UserService
from app.schemas.user_schema import UserSchema

user_bp = Blueprint('user_bp', __name__)
user_service = UserService()

user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    """
    Devuelve la información del usuario autenticado.
    """
    user_id = get_jwt_identity()
    try:
        user = user_service.get_user_by_id(user_id)
        return user_schema.dump(user), 200
    except Exception as e:
        return {"error": str(e)}, 404

@user_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    """
    Permite al usuario autenticado actualizar su información.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = user_service.update_user(user_id, data)
        return user_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 400

@user_bp.route('/me/password', methods=['PATCH'])
@jwt_required()
def change_my_password():
    """
    Cambia la contraseña del usuario autenticado, solicitando la contraseña actual y la nueva.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        user_service.change_password(user_id, current_password, new_password)
        return jsonify({"message": "Contraseña actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# --- Endpoints de administración o para uso especial ---

@user_bp.route('', methods=['GET'])
@jwt_required()
def get_all_users():
    """
    Retorna la lista de usuarios (normalmente acceso solo para admins).
    """
    # Ejemplo: podrías verificar si el current user es admin
    current_user_id = get_jwt_identity()
    # if not user_service.is_admin(current_user_id):
    #     return {"error": "No autorizado"}, 403

    try:
        users = user_service.get_all_users()
        return users_schema.dump(users), 200
    except Exception as e:
        return {"error": str(e)}, 400

@user_bp.route('/<int:uid>', methods=['GET'])
@jwt_required()
def get_user_by_id(uid):
    """
    Obtiene la info de un usuario por ID (por ejemplo, para uso del admin).
    """
    try:
        user = user_service.get_user_by_id(uid)
        return user_schema.dump(user), 200
    except Exception as e:
        return {"error": str(e)}, 404

@user_bp.route('/<int:uid>', methods=['PUT'])
@jwt_required()
def update_user_by_id(uid):
    """
    Actualiza los datos de un usuario específico (administración).
    """
    data = request.get_json()
    try:
        updated = user_service.update_user(uid, data)
        return user_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 400

@user_bp.route('/<int:uid>', methods=['DELETE'])
@jwt_required()
def delete_user_by_id(uid):
    """
    Elimina (borrado lógico) un usuario por ID (administración).
    """
    try:
        deleted_user = user_service.delete_user(uid)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
