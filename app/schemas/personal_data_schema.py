from marshmallow import Schema, fields

class PersonalDataSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    first_name = fields.Str()
    last_name = fields.Str()
    gender = fields.Str()
    age = fields.Int()
    birth_date = fields.Date(allow_none=True)
    city = fields.Str()
    country = fields.Str()
    phone = fields.Str()
    occupation = fields.Str()
    user_id = fields.Int()
