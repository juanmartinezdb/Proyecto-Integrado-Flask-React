from app import db
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import timedelta
import secrets

from app.services.user_service import UserService
from app.services.global_achievement_service import GlobalAchievementService
from app.services.skill_service import SkillService

global_ach_svc = GlobalAchievementService()

auth_bp = Blueprint('auth_bp', __name__)
user_service = UserService()

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registra un nuevo usuario. Puede devolver un token si quieres loguearlo automáticamente tras el registro.
    """
    data = request.get_json()
    try:
        # Se apoya en user_service.create_user
        new_user = user_service.create_user(data)  # Reutiliza create_user ya existente
        # Opcional: generar token directo
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            "message": "Usuario registrado exitosamente",
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Inicia sesión con username y password, devolviendo tokens JWT si las credenciales son correctas.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        user = user_service.get_user_by_username(username)  # lanza excepción si no existe
        if user.check_password(password):
            # Actualizamos streak de login (ejemplo simplificado)
            _update_login_streak(user)
            
            # Genera tokens
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))


            # LLAMADA A EVALUACIÓN DE LOGROS
            # "USER_LOGIN" => si un logro es de tipo "LOGIN_STREAK" o "Milagro de Año Nuevo", etc.
            global_ach_svc.evaluate_achievements(user.id, event="USER_LOGIN", extra_data={})

            return jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token
            }), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 401

def _update_login_streak(user):
    """
    Ejemplo rápido de actualización de racha de login:
    - Si user.last_login_date == hoy => no sube la racha
    - Si user.last_login_date == ayer => racha += 1
    - Else => racha = 1
    """
    from datetime import date, timedelta
    from app.services.skill_service import SkillService

    today = date.today()

    # Verifica si ya se hizo reset de mana hoy
    if not user.last_mana_reset_date or user.last_mana_reset_date != today:
        # Llama a skill_service para resetear el mana
        SkillService().reset_daily_mana(user.id)  
        user.last_mana_reset_date = today
        
    if user.last_login_date:
        if user.last_login_date == today:
            pass  # Ya hizo login hoy
        elif user.last_login_date == (today - timedelta(days=1)):
            user.login_streak += 1
        else:
            user.login_streak = 1
    else:
        user.login_streak = 1
    
    user.last_login_date = today
    db.session.commit()

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Usa el refresh token para solicitar un nuevo access token.
    """
    user_id = get_jwt_identity()
    # Opcionalmente, puedes validar datos extra del token
    new_access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": new_access_token}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Endpoint para iniciar el proceso de recuperación de contraseña.
    - Recibe un email o username
    - Genera un reset_token y lo asocia al usuario
    - (Opcional) envía correo con ese token
    """
    data = request.get_json()
    user_identifier = data.get('username') or data.get('email')
    if not user_identifier:
        return jsonify({"error": "Debe proveer username o email"}), 400

    try:
        reset_token = user_service.forgot_password(user_identifier)
        # Aquí podrías integrar lógica de envío de email. Ej:
        # send_reset_email(user.email, reset_token)
        return jsonify({
            "message": "Se ha generado un token de recuperación",
            "reset_token": reset_token  # en producción, usualmente no se expone directamente
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Completa el proceso de reset de contraseña usando el token.
    - Recibe reset_token y new_password
    """
    data = request.get_json()
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')

    if not reset_token or not new_password:
        return jsonify({"error": "Datos incompletos"}), 400

    try:
        user_service.reset_password(reset_token, new_password)
        return jsonify({"message": "Contraseña restablecida exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
