from app import db
from datetime import datetime

class Incident(db.Model):
    __tablename__ = "incident"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    type = db.Column(db.String(50))   # "BUG", "CRASH", "REQUEST", etc.
    status = db.Column(db.String(50), default="OPEN")  # "OPEN", "CLOSED", etc.
    description = db.Column(db.Text)
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Incident {self.id} type={self.type} status={self.status}>"
