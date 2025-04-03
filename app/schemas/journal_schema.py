from marshmallow import Schema, fields

class JournalSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    created_at = fields.DateTime()
    description = fields.Str()
    image = fields.Str()
    type = fields.Str()
    last_entry_date = fields.Date(allow_none=True)
    streak = fields.Int()
    user_id = fields.Int()

    # Si quieres ver las entradas de una sola vez,
    # podrías anidar un JournalEntrySchema o solo sus IDs:
    entries_ids = fields.List(fields.Int(), dump_only=True)
    
    project_id = fields.Int(allow_none=True)
