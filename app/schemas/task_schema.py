from marshmallow import Schema, fields

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    deleted = fields.Bool()
    name = fields.Str()
    description = fields.Str()
    image = fields.Str()
    status = fields.Str()
    energy = fields.Int()
    points = fields.Int()
    challenge_level = fields.Str()
    priority = fields.Str()
    cycle = fields.Str()
    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    active = fields.Bool()
    user_id = fields.Int()
    project_id = fields.Int(allow_none=True)
    parent_task_id = fields.Int(allow_none=True)
    # sub_tasks se puede incluir o dejarse fuera
