from app import db
from datetime import datetime

# project_habits = db.Table(
#     "project_habits",
#     db.Column("project_id", db.Integer, db.ForeignKey("project.id"), primary_key=True),
#     db.Column("habit_id", db.Integer, db.ForeignKey("habit.id"), primary_key=True)
# )

class Project(db.Model):
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    points = db.Column(db.Integer)
    energy = db.Column(db.Integer)
    # ChallengeLevel, si usas un enum. De lo contrario, omite.
    challenge_level = db.Column(db.String(50))

    image = db.Column(db.String(255))
    icon = db.Column(db.String(100))
    color = db.Column(db.String(50))

    status = db.Column(db.String(50))   # "ACTIVE", "COMPLETED", "ARCHIVED"
    priority = db.Column(db.String(50)) # "HIGH", "MEDIUM", "LOW"

    zone_id = db.Column(db.Integer, db.ForeignKey('zone.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    materials = db.relationship(
        "Material",
        secondary="project_materials",
        back_populates="projects"
    )

    # habits = db.relationship(
    #     "Habit",
    #     secondary="project_habits",
    #     back_populates="projects"
    # )

    # Relación OneToMany con Task: 
    tasks = db.relationship("Task", backref="project", lazy=True)

    journal = db.relationship("Journal", backref="project", uselist=False)

    def __repr__(self):
        return f"<Project {self.id} {self.name}>"
    
    def calculate_xp(self):
        base_xp = self.challenge_level.value[0]  # (xp_value, coins_value)
        multiplier = 1.0 + min(self.streak, 10)*0.1  # Máx x2 a 10 streak
        return int(base_xp * multiplier)