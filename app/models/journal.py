from app import db
from datetime import datetime

class Journal(db.Model):
    __tablename__ = "journal"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    type = db.Column(db.String(50))
    last_entry_date = db.Column(db.Date)
    streak = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    entries = db.relationship("JournalEntry", backref="journal", lazy=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True, unique=True)

    def __repr__(self):
        return f"<Journal {self.id} {self.name}>"
