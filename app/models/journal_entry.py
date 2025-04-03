from app import db
from datetime import date

class JournalEntry(db.Model):
    __tablename__ = "journal_entry"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    edited_at = db.Column(db.Date)
    content = db.Column(db.Text)
    points = db.Column(db.Integer)
    energy = db.Column(db.Integer)

    journal_id = db.Column(db.Integer, db.ForeignKey('journal.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<JournalEntry {self.id}>"
