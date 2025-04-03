from app import db

class Template(db.Model):
    __tablename__ = "template"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    energy = db.Column(db.Integer)
    points = db.Column(db.Integer)
    priority = db.Column(db.String(20))   # "HIGH", "MEDIUM", "LOW"
    cycle = db.Column(db.String(20))      # "NONE", "DAILY", "WEEKLY", etc.
    category = db.Column(db.String(20))   # "task", "habit", "project", etc.

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<Template {self.id} {self.name}>"
