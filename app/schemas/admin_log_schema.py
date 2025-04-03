from marshmallow import Schema, fields

class AdminLogSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    level = fields.Str()
    message = fields.Str()
    created_at = fields.DateTime()
