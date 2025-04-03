# app/models/user_global_achievement.py
from app import db
from datetime import datetime

class UserGlobalAchievement(db.Model):
    __tablename__ = "user_global_achievement"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    global_achievement_id = db.Column(db.Integer, db.ForeignKey('global_achievement.id'), nullable=False)

    achieved_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Campo opcional para almacenar el progreso que tenía el usuario cuando desbloqueó el logro
    # o para logros que trackean un valor incremental (p.ej., 10/10 tareas completadas).
    current_progress = db.Column(db.Integer, default=0)

    # Relationship
    global_achievement = db.relationship("GlobalAchievement", backref="unlocks", lazy="joined")

    def __repr__(self):
        return f"<UserGlobalAchievement user={self.user_id} ach={self.global_achievement_id}>"
