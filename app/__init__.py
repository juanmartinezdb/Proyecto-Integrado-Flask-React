from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from app.utils.db_utils import create_database_if_not_exists 

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configuración de CORS
    cors = CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    db.init_app(app)
    jwt.init_app(app)

    # Importar TODOS los modelos para que SQLAlchemy los reconozca
    from app.models import (
        user, personal_data, role, skill, effect, gear,
        challenge_level, habit, inventory_item, journal, journal_entry,
        log_entry, material, notification, project, task, template, zone,
        admin_log, incident, user_global_achievement, global_achievement
    )

    # Registrar Blueprints de controladores
    from app.controllers.auth_controller import auth_bp
    from app.controllers.user_controller import user_bp
    from app.controllers.habit_controller import habit_bp
    from app.controllers.log_entry_controller import log_entry_bp
    from app.controllers.zone_controller import zone_bp
    from app.controllers.template_controller import template_bp
    from app.controllers.task_controller import task_bp
    from app.controllers.skill_controller import skill_bp
    from app.controllers.project_controller import project_bp
    from app.controllers.notification_controller import notification_bp
    from app.controllers.material_controller import material_bp
    from app.controllers.journal_entry_controller import journal_entry_bp
    from app.controllers.journal_controller import journal_bp
    from app.controllers.inventory_controller import inventory_bp
    from app.controllers.effect_controller import effect_bp
    from app.controllers.gear_controller import gear_bp
    from app.controllers.store_controller import store_bp
    from app.controllers.stats_controller import stats_bp
    from app.controllers.agenda_controller import agenda_bp
    from app.controllers.search_controller import search_bp
    from app.controllers.admin_controller import admin_bp
    from app.controllers.achievements_controller import achievements_bp


    # Registrar Blueprints (puedes ordenarlos alfabéticamente o agruparlos lógicamente)

    app.register_blueprint(achievements_bp, url_prefix="/achievements")
    app.register_blueprint(agenda_bp, url_prefix="/agenda")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(effect_bp, url_prefix="/effects")
    app.register_blueprint(gear_bp, url_prefix="/gears")
    app.register_blueprint(habit_bp, url_prefix="/habits")
    app.register_blueprint(inventory_bp, url_prefix="/inventory")
    app.register_blueprint(journal_bp, url_prefix="/journals")
    app.register_blueprint(journal_entry_bp, url_prefix="/journals")
    app.register_blueprint(log_entry_bp, url_prefix="/log-entries")
    app.register_blueprint(material_bp, url_prefix="/materials")
    app.register_blueprint(notification_bp, url_prefix="/notifications")
    app.register_blueprint(project_bp, url_prefix="/projects")
    app.register_blueprint(search_bp, url_prefix="/search")  # NUEVO
    app.register_blueprint(skill_bp, url_prefix="/skills")
    app.register_blueprint(stats_bp, url_prefix="/stats")
    app.register_blueprint(store_bp, url_prefix="/store")
    app.register_blueprint(task_bp, url_prefix="/tasks")
    app.register_blueprint(template_bp, url_prefix="/templates")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(zone_bp, url_prefix="/zones")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    with app.app_context():
        create_database_if_not_exists(app) 
        db.create_all()
    return app
