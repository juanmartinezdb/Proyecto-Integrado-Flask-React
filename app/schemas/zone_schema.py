from marshmallow import Schema, fields

class ZoneSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    image = fields.Str()
    color = fields.Str()
    energy = fields.Int()
    xp = fields.Int()
    level = fields.Int()
    user_id = fields.Int()
    
    yellow_gems = fields.Int()