from marshmallow import Schema, fields

class LogEntrySchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    challenge_level = fields.Str()
    type = fields.Str()
    item_id = fields.Int()
    end_timestamp = fields.Date()
    energy = fields.Int()
    user_id = fields.Int()
    zone_id = fields.Int()
