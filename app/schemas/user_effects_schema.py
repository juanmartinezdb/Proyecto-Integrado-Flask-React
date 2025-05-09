from marshmallow import Schema, fields

class UserEffectsSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int()
    double_energy_next_active = fields.Bool()
    xp_multiplier = fields.Float()
    xp_multiplier_expires = fields.DateTime(allow_none=True)
    store_discount_active = fields.Bool()
    store_discount_value = fields.Float()
    skip_penalty_active = fields.Bool()
    skip_penalty_expires = fields.DateTime(allow_none=True)
    shield_energy_loss_until = fields.DateTime(allow_none=True)
    double_rewards_until = fields.DateTime(allow_none=True)
    no_habit_loss_weekend_expires = fields.DateTime(allow_none=True)
    stackable_energy_active = fields.Bool()
    stackable_energy_expires = fields.DateTime(allow_none=True)
    stackable_energy_count = fields.Int()
    daily_first_completion_active = fields.Bool()
    daily_first_completion_date = fields.Date(allow_none=True)
    daily_first_completion_used = fields.Bool()
    zone_effects_json = fields.Str(allow_none=True)
