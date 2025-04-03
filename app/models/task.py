from app import db
from datetime import date
from app.models.challenge_level import ChallengeLevel

class Task(db.Model):
    __tablename__ = "task"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    status = db.Column(db.String(20))         # Ejemplo: "PENDING", "COMPLETED", etc.
    energy = db.Column(db.Integer)
    points = db.Column(db.Integer)

    challenge_level = db.Column(db.Enum(ChallengeLevel))
    priority = db.Column(db.String(20))       # "HIGH", "MEDIUM", "LOW"
    cycle = db.Column(db.String(20))          # "NONE", "DAILY", "WEEKLY", ...

    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    active = db.Column(db.Boolean, default=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)

    parent_task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)
    sub_tasks = db.relationship(
        "Task",
        backref=db.backref("parent_task", remote_side=[id]),
        cascade="all"
    )


    def __repr__(self):
        return f"<Task {self.id} {self.name}>"
    
