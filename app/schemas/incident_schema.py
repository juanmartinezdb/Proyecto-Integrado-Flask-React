from marshmallow import Schema, fields

class IncidentSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    type = fields.Str()
    status = fields.Str()
    description = fields.Str()
    reported_at = fields.DateTime()
