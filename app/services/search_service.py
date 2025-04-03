from app.models.task import Task
from app.models.habit import Habit
from app.models.project import Project
from app.models.material import Material
from app.models.zone import Zone
from app import db
from sqlalchemy import or_

class SearchService:
    def global_search(self, user_id, query, included_types, zone_id):
        """
        Realiza una búsqueda textual parcial en Task, Habit, Project, Material, etc.
        - user_id: filtra solo entidades del usuario
        - query: string a buscar
        - included_types: lista con "task","habit","project","material", ...
        - zone_id: filtra si corresponde (tasks -> project.zone_id, habit.zone_id, project.zone_id, etc.)

        Retorna un diccionario con los resultados.
        Ejemplo:
        {
          "task": [ {...}, {...} ],
          "habit": [ {...} ],
          "project": [],
          "material": [...]
        }
        """
        results = {}
        # Normalizamos
        q_like = f"%{query}%"

        # Buscar TAREAS
        if "task" in included_types:
            t_query = Task.query.filter_by(user_id=user_id, deleted=False)
            if query:
                t_query = t_query.filter(
                    or_(
                        Task.name.ilike(q_like),
                        Task.description.ilike(q_like)
                    )
                )
            if zone_id:
                # filtrar tasks que pertenezcan a un project con zone_id
                t_query = t_query.join(Project).filter(Project.zone_id == zone_id)
            tasks = t_query.all()
            results["task"] = [
                {
                    "id": t.id,
                    "name": t.name,
                    "description": t.description,
                    "zone_id": t.project.zone_id if t.project else None,
                    "status": t.status
                }
                for t in tasks
            ]

        # Buscar HÁBITOS
        if "habit" in included_types:
            h_query = Habit.query.filter_by(user_id=user_id, deleted=False)
            if query:
                h_query = h_query.filter(
                    or_(
                        Habit.name.ilike(q_like),
                        Habit.description.ilike(q_like)
                    )
                )
            if zone_id:
                h_query = h_query.filter_by(zone_id=zone_id)
            habits = h_query.all()
            results["habit"] = [
                {
                    "id": h.id,
                    "name": h.name,
                    "description": h.description,
                    "zone_id": h.zone_id
                }
                for h in habits
            ]

        # Buscar PROYECTOS
        if "project" in included_types:
            p_query = Project.query.filter_by(user_id=user_id, deleted=False)
            if query:
                p_query = p_query.filter(
                    or_(
                        Project.name.ilike(q_like),
                        Project.description.ilike(q_like)
                    )
                )
            if zone_id:
                p_query = p_query.filter_by(zone_id=zone_id)
            projects = p_query.all()
            results["project"] = [
                {
                    "id": p.id,
                    "name": p.name,
                    "description": p.description,
                    "zone_id": p.zone_id
                }
                for p in projects
            ]

        # Buscar MATERIALES
        if "material" in included_types:
            m_query = Material.query.filter_by(user_id=user_id, deleted=False)
            if query:
                m_query = m_query.filter(
                    or_(
                        Material.name.ilike(q_like),
                        Material.description.ilike(q_like)
                    )
                )
            # zone_id no es directo en Material, se asocia via projects -> zone
            # Podríamos unir project_materials y project, filtrar zone_id
            if zone_id:
                m_query = m_query.join(Material.projects).filter(Project.zone_id == zone_id)
            mats = m_query.all()
            results["material"] = [
                {
                    "id": m.id,
                    "name": m.name,
                    "description": m.description,
                    "type": m.type
                }
                for m in mats
            ]

        return results
