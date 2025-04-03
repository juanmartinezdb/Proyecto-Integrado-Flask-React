from app import db

class Gear(db.Model):
    __tablename__ = "gear"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    type = db.Column(db.String(50))  # "mental", "physical", "emotional", "all", etc.
    max_uses = db.Column(db.Integer)
    cost = db.Column(db.Integer, default=0)
    level_required = db.Column(db.Integer, default=1) 
    consumable = db.Column(db.Boolean, default=True)
    rarity = db.Column(db.String(50))

    # Relación ManyToOne con "Effect"
    effect_id = db.Column(db.Integer, db.ForeignKey('effect.id'), nullable=False)

    def __repr__(self):
        return f"<Gear {self.id} {self.name}>"
