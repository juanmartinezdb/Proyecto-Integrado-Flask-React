# from app import db

# class Achievement(db.Model):
#     __tablename__ = "achievement"

#     id = db.Column(db.Integer, primary_key=True)
#     deleted = db.Column(db.Boolean, default=False)

#     name = db.Column(db.String(100), nullable=False)
#     description = db.Column(db.String(255))
#     type = db.Column(db.String(50))    # "streak", "xp", "tasks_completed", etc.
#     threshold = db.Column(db.Integer)  # Ej: 10 tareas para desbloquear
#     unlocked = db.Column(db.Boolean, default=False)

#     # Relación ManyToOne con User
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

#     def __repr__(self):
#         return f"<Achievement {self.id} {self.name}>"
