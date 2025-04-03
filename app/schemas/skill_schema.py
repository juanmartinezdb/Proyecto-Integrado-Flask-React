from marshmallow import Schema, fields

class SkillSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    type = fields.Str()
    level_required = fields.Int()
    cost = fields.Int()
    mana = fields.Int()
    icon = fields.Str()
    effect_id = fields.Int()
    
    is_zone_skill = fields.Bool()
