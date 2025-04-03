from marshmallow import Schema, fields

class GearSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()

    name = fields.Str()
    description = fields.Str()
    image = fields.Str()
    type = fields.Str()
    max_uses = fields.Int()
    cost = fields.Int()
    consumable = fields.Bool()
    rarity = fields.Str()
    effect_id = fields.Int()

    level_required = fields.Int()
