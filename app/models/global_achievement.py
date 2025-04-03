from app import db
from datetime import datetime

class GlobalAchievement(db.Model):
    __tablename__ = "global_achievement"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    
    # Tipo o "condición" principal: "TASKS_COMPLETED", "HABIT_STREAK", "LOGIN_STREAK",
    # "SURPRISE", etc.
    condition_type = db.Column(db.String(50), nullable=False)

    # Valor de umbral / meta para desbloquear: número de tareas, días, etc.
    threshold = db.Column(db.Integer, default=0)

    # Título honorífico a mostrar cuando se desbloquea (ej. “Caballero de Juramenta de Tareas”)
    honorific_title = db.Column(db.String(100))

    # Campo opcional para designar logros "sorpresa" o con condiciones especiales.
    # Podrías usar un booleano extra o un campo "condition_data" para almacenar configs extra.
    is_surprise = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<GlobalAchievement {self.id} {self.name}>"
