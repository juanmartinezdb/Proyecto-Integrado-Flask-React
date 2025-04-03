from marshmallow import Schema, fields

class EffectSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    logic_key = fields.Str()
    description = fields.Str()
    type = fields.Str()
    target_entities = fields.Str()  
    # O lo que uses para serializar la lista
