from marshmallow import Schema, fields

class JournalEntrySchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    edited_at = fields.Date()
    content = fields.Str()
    points = fields.Int()
    journal_id = fields.Int()
    user_id = fields.Int()
    energy = fields.Int()
