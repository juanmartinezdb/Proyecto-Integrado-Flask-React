from marshmallow import Schema, fields

class HabitSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    image = fields.Str()
    active = fields.Bool()
    energy = fields.Int()
    points = fields.Int()
    frequency = fields.Str()
    streak = fields.Int()
    total_check = fields.Int()
    challenge_level = fields.Str()
    zone_id = fields.Int(allow_none=True)
    # effect_id = fields.Int(allow_none=True)
    user_id = fields.Int()
