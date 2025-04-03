from marshmallow import Schema, fields

class TemplateSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    energy = fields.Int()
    points = fields.Int()
    priority = fields.Str()
    cycle = fields.Str()
    category = fields.Str()
    user_id = fields.Int()
