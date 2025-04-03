from app import db
from app.models.challenge_level import ChallengeLevel

class Habit(db.Model):
    __tablename__ = "habit"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))

    active = db.Column(db.Boolean, default=True)
    energy = db.Column(db.Integer)
    points = db.Column(db.Integer)
    frequency = db.Column(db.String(20))  # "DAILY", "WEEKLY", "MONTHLY", ...
    streak = db.Column(db.Integer, default=0)
    total_check = db.Column(db.Integer, default=0)

    challenge_level = db.Column(db.Enum(ChallengeLevel))

    zone_id = db.Column(db.Integer, db.ForeignKey('zone.id'), nullable=True)
    # effect_id = db.Column(db.Integer, db.ForeignKey('effect.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<Habit {self.id} {self.name}>"

    def calculate_xp(self):
        base_xp = self.challenge_level.value[0]  # (xp_value, coins_value)
        multiplier = 1.0 + min(self.streak, 10)*0.1  # Máx x2 a 10 streak
        return int(base_xp * multiplier)
