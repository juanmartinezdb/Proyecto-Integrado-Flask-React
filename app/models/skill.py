from app import db

class Skill(db.Model):
    __tablename__ = "skill"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    is_zone_skill = db.Column(db.Boolean, default=False) # para las skills de zona

    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    type = db.Column(db.String(50))   # "mental", "physical", etc.
    level_required = db.Column(db.Integer)
    cost = db.Column(db.Integer)
    mana = db.Column(db.Integer)
    icon = db.Column(db.String(100))

    effect_id = db.Column(db.Integer, db.ForeignKey('effect.id'), nullable=False)

    # Si deseas una relación con usuarios:
    # ManyToMany: user_skills (tabla intermedia), etc.

    def __repr__(self):
        return f"<Skill {self.id} {self.name}>"
