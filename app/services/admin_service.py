from app import db
from app.models.user import User
from app.models.role import Role
from app.models.admin_log import AdminLog
from app.models.incident import Incident
# from app.models.achievement import Achievement
from app.models.task import Task
from app.models.habit import Habit
from datetime import datetime
import io

class AdminService:

    def list_all_users(self):
        """Lista todos los usuarios (incluyendo borrados si quisieras). 
           Aquí dejamos solo los activos (deleted=False)."""
        return User.query.filter_by(deleted=False).all()

    def update_user_role(self, user_id, new_role):
        """Cambia el rol de un usuario a USER o ADMIN."""
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")
        try:
            user.role = Role(new_role)
        except ValueError:
            raise Exception("Rol no válido. Use 'USER' o 'ADMIN'")
        db.session.commit()
        self._create_admin_log(
            level="INFO",
            message=f"Role del usuario {user.username} actualizado a {new_role}"
        )
        return user

    def create_admin_log(self, level, message):
        """Crea un registro manual en admin_log."""
        return self._create_admin_log(level, message)

    def list_admin_logs(self, level_filter=None):
        """Lista logs de admin, opcional filtra por nivel."""
        q = AdminLog.query.filter_by(deleted=False)
        if level_filter:
            q = q.filter_by(level=level_filter)
        return q.all()

    def delete_admin_log(self, log_id):
        """Soft delete de un log."""
        log = AdminLog.query.filter_by(id=log_id, deleted=False).first()
        if not log:
            raise Exception("Log no encontrado.")
        log.deleted = True
        db.session.commit()

    def create_incident(self, incident_type, description):
        """Crea una incidencia."""
        inc = Incident(
            type=incident_type,
            description=description,
            deleted=False
        )
        db.session.add(inc)
        db.session.commit()
        self._create_admin_log("WARN", f"Nueva incidencia creada: {incident_type}")
        return inc

    def list_incidents(self, status=None):
        """Lista incidencias, filtrando por estado si se desea."""
        q = Incident.query.filter_by(deleted=False)
        if status:
            q = q.filter_by(status=status)
        return q.all()

    def close_incident(self, incident_id):
        """Cierra la incidencia marcándola con status=CLOSED."""
        inc = Incident.query.filter_by(id=incident_id, deleted=False).first()
        if not inc:
            raise Exception("Incidencia no encontrada")
        inc.status = "CLOSED"
        db.session.commit()
        self._create_admin_log("INFO", f"Incidencia {incident_id} cerrada.")
        return inc

    def reset_global_data(self):
        """
        Herramienta de 'borrado' o reset global de datos. 
        WARNING: Aquí es solo un ejemplo y podría ser muy peligroso en producción.
        """
        # Ejemplo: eliminar tasks, habits, achievements, etc.
        # Para que sea 'reset' real, quizás quieras TRUNCATE las tablas.
        Task.query.update({Task.deleted: True})
        Habit.query.update({Habit.deleted: True})
        # Achievement.query.update({Achievement.deleted: True})
        db.session.commit()
        self._create_admin_log("ERROR", "Reset global de datos aplicado.")
        return {"message": "Datos globales reseteados (soft delete)."}

    def generate_report_csv(self):
        """
        Ejemplo de generación de un reporte CSV (productividad, logros, etc.).
        Retorna un string CSV. 
        Aquí hacemos algo muy simple; ajusta según tus necesidades.
        """
        output = io.StringIO()
        output.write("User,XP,Level,Points\n")
        users = User.query.filter_by(deleted=False).all()
        for u in users:
            output.write(f"{u.username},{u.xp},{u.level},{u.points}\n")
        csv_content = output.getvalue()
        output.close()
        return csv_content

    def generate_report_pdf(self):
        """
        Ejemplo minimalista de "generación" de PDF. 
        En la práctica usarías una librería como ReportLab, WeasyPrint, etc.
        """
        # Aquí solo devolvemos un string simulando PDF.
        pdf_content = "PDF_CONTENT_MOCK\nUsers Productivity Report\n"
        users = User.query.filter_by(deleted=False).all()
        for u in users:
            pdf_content += f"User: {u.username} | XP: {u.xp} | Level: {u.level}\n"
        return pdf_content

    # ---- MÉTODOS PRIVADOS ----
    def _create_admin_log(self, level, message):
        log = AdminLog(
            level=level.upper(),
            message=message,
            deleted=False
        )
        db.session.add(log)
        db.session.commit()
        return log
