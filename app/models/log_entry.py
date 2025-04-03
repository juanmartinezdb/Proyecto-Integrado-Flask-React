from app import db
from datetime import date
from app.models.challenge_level import ChallengeLevel

class LogEntry(db.Model):
    __tablename__ = "log_entry"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    challenge_level = db.Column(db.Enum(ChallengeLevel))
    type = db.Column(db.String(20))   # "TASK", "HABIT", "JOURNAL_ENTRY", etc.
    item_id = db.Column(db.Integer)
    end_timestamp = db.Column(db.Date)
    energy = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    zone_id = db.Column(db.Integer, db.ForeignKey('zone.id'), nullable=False)

    def __repr__(self):
        return f"<LogEntry {self.id}>"
