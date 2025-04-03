from app import db
from datetime import datetime

class AdminLog(db.Model):
    __tablename__ = "admin_log"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    level = db.Column(db.String(50), default="INFO")  # "INFO", "WARN", "ERROR"
    message = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<AdminLog {self.id} level={self.level}>"
