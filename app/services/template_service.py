from app import db
from app.models.template import Template
from app.models.task import Task
from app.models.habit import Habit
from app.models.project import Project
from datetime import date

class TemplateService:
    def get_all_templates(self, user_id, category=None):
        query = Template.query.filter_by(user_id=user_id, deleted=False)
        if category:
            query = query.filter_by(category=category)
        return query.all()

    def get_by_id(self, template_id, user_id):
        t = Template.query.filter_by(id=template_id, deleted=False).first()
        if not t:
            raise Exception("Template no encontrado.")
        if t.user_id != int(user_id):
            raise Exception("No tienes acceso a este Template.")
        return t

    def create_template(self, data, user_id):
        temp = Template(
            name=data.get('name'),
            description=data.get('description'),
            energy=data.get('energy', 0),
            points=data.get('points', 0),
            priority=data.get('priority', 'MEDIUM'),
            cycle=data.get('cycle', 'NONE'),
            category=data.get('category', 'task'),  # 'habit', 'project', etc.
            user_id=user_id,
            deleted=False
        )
        db.session.add(temp)
        db.session.commit()
        return temp

    def update_template(self, template_id, data, user_id):
        t = self.get_by_id(template_id, user_id)
        t.name = data.get('name', t.name)
        t.description = data.get('description', t.description)
        t.energy = data.get('energy', t.energy)
        t.points = data.get('points', t.points)
        t.priority = data.get('priority', t.priority)
        t.cycle = data.get('cycle', t.cycle)
        t.category = data.get('category', t.category)
        db.session.commit()
        return t

    def delete_template(self, template_id, user_id):
        t = self.get_by_id(template_id, user_id)
        t.deleted = True
        db.session.commit()

    def use_template(self, template_id, user_id, overrides):
        """
        Aplica la plantilla para crear un nuevo 'task', 'habit' o 'project'.
        - overrides: dict con campos que se quieren sobreescribir a la plantilla.
        - Retorna el objeto creado (en dict form).
        """
        from app.schemas.task_schema import TaskSchema
        from app.schemas.habit_schema import HabitSchema
        from app.schemas.project_schema import ProjectSchema

        t = self.get_by_id(template_id, user_id)
        cat = t.category  # "task", "habit", "project", etc.

        # Mezclamos los datos de la plantilla con overrides
        # (la plantilla define energy, points, priority, cycle, etc.)
        final_data = {
            "name": overrides.get("name", t.name),
            "description": overrides.get("description", t.description),
            "energy": overrides.get("energy", t.energy),
            "points": overrides.get("points", t.points),
            "priority": overrides.get("priority", t.priority),
            "cycle": overrides.get("cycle", t.cycle)
            # Podrías añadir más campos si aplica
        }

        if cat == "task":
            # Creamos un Task
            new_task = Task(
                name=final_data["name"],
                description=final_data["description"],
                energy=final_data["energy"],
                points=final_data["points"],
                priority=final_data["priority"],
                cycle=final_data["cycle"],
                # status por defecto PENDING
                status="PENDING",
                user_id=user_id,
                deleted=False
            )
            db.session.add(new_task)
            db.session.commit()
            return TaskSchema().dump(new_task)

        elif cat == "habit":
            # Creamos un Habit
            new_habit = Habit(
                name=final_data["name"],
                description=final_data["description"],
                energy=final_data["energy"],
                points=final_data["points"],
                frequency=final_data["cycle"],  # en Habit es 'frequency'
                user_id=user_id,
                deleted=False
            )
            db.session.add(new_habit)
            db.session.commit()
            return HabitSchema().dump(new_habit)

        elif cat == "project":
            # Creamos un Project
            new_project = Project(
                name=final_data["name"],
                description=final_data["description"],
                points=final_data["points"],
                priority=final_data["priority"],
                # cycle no es muy usado en Project, pero podrías mapearlo
                user_id=user_id,
                deleted=False
            )
            db.session.add(new_project)
            db.session.commit()
            return ProjectSchema().dump(new_project)

        else:
            raise Exception(f"Categoría {cat} no implementada en use_template.")
