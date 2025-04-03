from app import db
from app.models.notification import Notification
from datetime import datetime

class NotificationService:
    def get_user_notifications(self, user_id):
        """
        Obtiene todas las notificaciones (no borradas) de un usuario.
        """
        return Notification.query.filter_by(user_id=user_id, deleted=False).all()

    def get_user_notifications_filtered(self, user_id, notif_type=None):
        """
        Versión extendida que filtra por tipo.
        """
        q = Notification.query.filter_by(user_id=user_id, deleted=False)
        if notif_type:
            q = q.filter_by(type=notif_type)
        return q.all()

    def mark_as_read(self, notification_id, user_id):
        notif = Notification.query.filter_by(id=notification_id, deleted=False).first()
        if not notif:
            raise Exception("Notificación no encontrada.")
        if notif.user_id != user_id:
            raise Exception("No tienes acceso a esta notificación.")
        notif.is_read = True
        db.session.commit()

    def mark_all_as_read(self, user_id):
        """
        Marca todas las notificaciones del usuario como leídas.
        Retorna cuántas se han marcado.
        """
        notifs = Notification.query.filter_by(user_id=user_id, deleted=False, is_read=False).all()
        count = 0
        for n in notifs:
            n.is_read = True
            count += 1
        db.session.commit()
        return count

    def create_notification(self, data, user_id):
        notif = Notification(
            message=data.get('message'),
            type=data.get('type'),
            is_read=False,
            user_id=user_id,
            deleted=False,
            created_at=datetime.utcnow()
        )
        db.session.add(notif)
        db.session.commit()
        return notif

    def delete_notification(self, notification_id, user_id):
        notif = Notification.query.filter_by(id=notification_id, deleted=False).first()
        if not notif:
            raise Exception("Notificación no encontrada.")
        if notif.user_id != user_id:
            raise Exception("No tienes acceso a esta notificación.")
        notif.deleted = True
        db.session.commit()
