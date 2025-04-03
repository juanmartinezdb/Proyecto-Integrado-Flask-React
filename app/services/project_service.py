from app import db
from app.models.project import Project
from app.models.material import Material
from app.models.habit import Habit
from app.models.task import Task
from datetime import datetime, date
from app.services.log_service import LogService
from app.services.stats_service import StatsService
from app.services.zone_service import ZoneService
zone_service = ZoneService()
log_service = LogService()
stats_service = StatsService()

class ProjectService:
    def get_projects_with_filters(self, user_id, zone_id=None, status=None,
                                  priority=None, start_date=None, end_date=None):
        """
        Filtra proyectos según los parámetros proporcionados.
        """
        query = Project.query.filter_by(user_id=user_id, deleted=False)

        if zone_id:
            query = query.filter_by(zone_id=zone_id)

        if status:
            query = query.filter_by(status=status)

        if priority:
            query = query.filter_by(priority=priority)

        if start_date:
            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
                query = query.filter(Project.start_date >= start_dt)
            except:
                pass
        if end_date:
            try:
                end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
                query = query.filter(Project.end_date <= end_dt)
            except:
                pass

        return query.all()

    def get_project_by_id(self, project_id, user_id):
        prj = Project.query.filter_by(id=project_id, deleted=False).first()
        if not prj:
            raise Exception("Proyecto no encontrado.")
        if prj.user_id != int(user_id):
            raise Exception("No tienes acceso a este proyecto.")
        return prj

    def create_project(self, data, user_id):
        prj = Project(
            name=data.get('name'),
            description=data.get('description'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            points=data.get('points', 0),
            challenge_level=data.get('challenge_level'),
            image=data.get('image'),
            icon=data.get('icon'),
            color=data.get('color'),
            status=data.get('status'),
            priority=data.get('priority'),
            zone_id=data.get('zone_id'),
            user_id=user_id,
            deleted=False
        )
        db.session.add(prj)

        # Asocia Materials
        materials_ids = data.get('materials_ids', [])
        for mid in materials_ids:
            mat = Material.query.filter_by(id=mid, deleted=False).first()
            if mat and mat.user_id == user_id:
                prj.materials.append(mat)

        # Asocia Habits
        habits_ids = data.get('habits_ids', [])
        for hid in habits_ids:
            hb = Habit.query.filter_by(id=hid, deleted=False).first()
            if hb and hb.user_id == user_id:
                prj.habits.append(hb)

        db.session.commit()
        return prj

    def update_project(self, project_id, data, user_id):
        prj = self.get_project_by_id(project_id, user_id)
        prj.name = data.get('name', prj.name)
        prj.description = data.get('description', prj.description)
        prj.start_date = data.get('start_date', prj.start_date)
        prj.end_date = data.get('end_date', prj.end_date)
        prj.points = data.get('points', prj.points)
        prj.challenge_level = data.get('challenge_level', prj.challenge_level)
        prj.image = data.get('image', prj.image)
        prj.icon = data.get('icon', prj.icon)
        prj.color = data.get('color', prj.color)
        prj.status = data.get('status', prj.status)
        prj.priority = data.get('priority', prj.priority)
        prj.zone_id = data.get('zone_id', prj.zone_id)

        if 'materials_ids' in data:
            prj.materials.clear()
            for mid in data['materials_ids']:
                mat = Material.query.filter_by(id=mid, deleted=False).first()
                if mat and mat.user_id == user_id:
                    prj.materials.append(mat)

        if 'habits_ids' in data:
            prj.habits.clear()
            for hid in data['habits_ids']:
                hb = Habit.query.filter_by(id=hid, deleted=False).first()
                if hb and hb.user_id == user_id:
                    prj.habits.append(hb)

        db.session.commit()
        return prj

    def delete_project(self, project_id, user_id):
        prj = self.get_project_by_id(project_id, user_id)
        prj.deleted = True
        db.session.commit()

    def get_project_progress(self, project_id, user_id):
        """
        Calcula porcentaje de tareas completadas, energía total acumulada, etc.
        - Tareas: prj.tasks
        """
        prj = self.get_project_by_id(project_id, user_id)

        tasks = [t for t in prj.tasks if not t.deleted]
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.status == "COMPLETED")

        pct_completed = 0
        if total_tasks > 0:
            pct_completed = (completed_tasks / total_tasks) * 100

        # Energía total (sum of tasks' energy, etc.)
        total_energy = sum(t.energy for t in tasks)

        # XP total (si usas t.points, etc.)
        total_xp = sum(t.points for t in tasks)

        return {
            "project_id": prj.id,
            "name": prj.name,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_percentage": pct_completed,
            "total_energy": total_energy,
            "total_xp": total_xp
        }
    def complete_project(self, project_id, user_id):
        p = self.get_project_by_id(project_id, user_id)
        p.status = "COMPLETED"
        db.session.commit()

        log_service.create_log(user_id, "PROJECT", p.id, p.points or 0)

        xp_gained = p.points or 0
        coins_gained = xp_gained

        if p.zone_id:
            zone_service.add_xp_to_zone(p.zone_id, xp_gained)

        stats_service.add_xp_and_coins_to_user(user_id, xp_gained, coins_gained)
        return p
