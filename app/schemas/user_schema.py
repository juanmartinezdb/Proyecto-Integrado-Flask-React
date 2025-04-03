from marshmallow import Schema, fields
from app.schemas.personal_data_schema import PersonalDataSchema
from app.schemas.user_effects_schema import UserEffectsSchema


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    username = fields.Str()
    email = fields.Str()

    # Datos de gamificación básicos
    energy = fields.Int()
    xp = fields.Int()
    coins = fields.Int()
    level = fields.Int()

    # Este era un ejemplo de tu modelo original
    # skill_points = fields.Int()
    mana = fields.Int()
    # streak = fields.Int()  # etc., si existía en tu modelo

    # Relación 1:1 con personal_data
    personal_data = fields.Nested(PersonalDataSchema, many=False, allow_none=True)
    user_effects = fields.Nested(UserEffectsSchema, many=False, allow_none=True)
