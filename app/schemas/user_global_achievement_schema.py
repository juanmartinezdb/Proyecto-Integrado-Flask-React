from marshmallow import Schema, fields
from app.schemas.global_achievement_schema import GlobalAchievementSchema

class UserGlobalAchievementSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    user_id = fields.Int()
    global_achievement_id = fields.Int()
    achieved_at = fields.DateTime()
    current_progress = fields.Int()

    # Si quieres anidar el GlobalAchievement completo:
    # (necesitas en tu modelo una relationship many-to-one con lazy='joined')
    global_achievement = fields.Nested(GlobalAchievementSchema, dump_only=True)
