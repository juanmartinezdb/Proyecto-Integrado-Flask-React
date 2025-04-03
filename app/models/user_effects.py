from app import db
from datetime import datetime

class UserEffects(db.Model):
    __tablename__ = "user_effects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    double_energy_next_active = db.Column(db.Boolean, default=False)

    xp_multiplier = db.Column(db.Float, default=1.0)
    xp_multiplier_expires = db.Column(db.DateTime, nullable=True)

    store_discount_active = db.Column(db.Boolean, default=False)
    store_discount_value = db.Column(db.Float, default=0.0)

    skip_penalty_active = db.Column(db.Boolean, default=False)
    skip_penalty_expires = db.Column(db.DateTime, nullable=True)

    shield_energy_loss_until = db.Column(db.DateTime, nullable=True)

    double_rewards_until = db.Column(db.DateTime, nullable=True)

    no_habit_loss_weekend_expires = db.Column(db.DateTime, nullable=True)

    stackable_energy_active = db.Column(db.Boolean, default=False)
    stackable_energy_expires = db.Column(db.DateTime, nullable=True)
    stackable_energy_count = db.Column(db.Integer, default=0)

    daily_first_completion_active = db.Column(db.Boolean, default=False)
    daily_first_completion_date = db.Column(db.Date, nullable=True)
    daily_first_completion_used = db.Column(db.Boolean, default=False)

    zone_effects_json = db.Column(db.Text)  # JSON con efectos por zona, si lo usas

    # Relación 1:1 inversa
    user = db.relationship("User", back_populates="user_effects")

    def __repr__(self):
        return f"<UserEffects user_id={self.user_id}>"