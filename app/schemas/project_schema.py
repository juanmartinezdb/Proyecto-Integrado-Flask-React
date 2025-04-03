from marshmallow import Schema, fields

class ProjectSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()

    name = fields.Str()
    description = fields.Str()
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    created_at = fields.DateTime()
    points = fields.Int()
    energy = fields.Int()
    challenge_level = fields.Str()
    image = fields.Str()
    icon = fields.Str()
    color = fields.Str()
    status = fields.Str()
    priority = fields.Str()
    zone_id = fields.Int(allow_none=True)
    user_id = fields.Int()

    materials_ids = fields.List(fields.Int(), dump_only=True)
    journal_id = fields.Int(dump_only=True)
    
    # habits_ids = fields.List(fields.Int(), dump_only=True)
