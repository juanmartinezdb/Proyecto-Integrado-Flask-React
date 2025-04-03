from app import db
from datetime import datetime

class InventoryItem(db.Model):
    __tablename__ = "inventory_item"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)
    remaining_uses = db.Column(db.Integer)
    acquired_at = db.Column(db.DateTime, default=datetime.utcnow)

    gear_id = db.Column(db.Integer, db.ForeignKey('gear.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<InventoryItem {self.id}>"
