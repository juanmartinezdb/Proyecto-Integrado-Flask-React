from marshmallow import Schema, fields

class MaterialSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    type = fields.Str()
    image = fields.Str()
    url = fields.Str()
    description = fields.Str()
    user_id = fields.Int()
    zone_id = fields.Int(allow_none=True)
