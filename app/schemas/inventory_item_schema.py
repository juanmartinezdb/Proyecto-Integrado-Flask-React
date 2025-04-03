from marshmallow import Schema, fields

class InventoryItemSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    remaining_uses = fields.Int()
    acquired_at = fields.DateTime()
    gear_id = fields.Int()
    user_id = fields.Int()
