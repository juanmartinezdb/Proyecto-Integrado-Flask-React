from marshmallow import Schema, fields

class GlobalAchievementSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    condition_type = fields.Str()
    threshold = fields.Int()
    honorific_title = fields.Str(allow_none=True)
    is_surprise = fields.Bool()
