from marshmallow import Schema, fields

class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    message = fields.Str()
    type = fields.Str()
    is_read = fields.Bool()
    created_at = fields.DateTime()
    user_id = fields.Int()
