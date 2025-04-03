from app import db
from app.models.task import Task
from app.models.project import Project
from datetime import date, datetime
from app.services.log_service import LogService
from app.services.stats_service import StatsService
from app.services.zone_service import ZoneService
from app.models.user import User
from app.services.global_achievement_service import GlobalAchievementService
global_ach_svc = GlobalAchievementService()
log_service = LogService()
stats_service = StatsService()
zone_service = ZoneService()

class TaskService:

    def get_tasks_with_filters(self, user_id, status=None, priority=None, cycle=None,
                               project_id=None, zone_id=None,
                               start_date=None, end_date=None):
        query = Task.query.filter_by(user_id=user_id, deleted=False)

        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)
        if cycle:
            query = query.filter_by(cycle=cycle)
        if project_id:
            query = query.filter_by(project_id=project_id)

        # Filtrado indirecto por zone_id (si un Task -> project -> zone_id)
        # Podrías unirte con Project para filtrar.
        if zone_id:
            query = query.join(Project).filter(Project.zone_id == zone_id)

        # Si tu modelo Task tiene created_at o start_date como la fecha de creación/planificación:
        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d").date()
                query = query.filter(Task.start_date >= start)
            except:
                pass
        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d").date()
                query = query.filter(Task.end_date <= end)
            except:
                pass

        return query.all()

    def get_task_by_id(self, task_id, user_id):
        t = Task.query.filter_by(id=task_id, deleted=False).first()
        if not t:
            raise Exception("Task no encontrada.")
        if t.user_id != int(user_id):
            raise Exception("No tienes acceso a esta Task.")
        return t

    def create_task(self, data, user_id):
        new_task = Task(
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            status=data.get('status', 'PENDING'),
            energy=data.get('energy', 0),
            points=data.get('points', 0),
            challenge_level=data.get('challenge_level'),
            priority=data.get('priority', 'MEDIUM'),
            cycle=data.get('cycle', 'NONE'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            active=data.get('active', True),
            user_id=user_id,
            project_id=data.get('project_id'),
            parent_task_id=data.get('parent_task_id'),
            deleted=False
        )
        db.session.add(new_task)
        db.session.commit()
        return new_task

    def update_task(self, task_id, data, user_id):
        t = self.get_task_by_id(task_id, user_id)
        t.name = data.get('name', t.name)
        t.description = data.get('description', t.description)
        t.image = data.get('image', t.image)
        t.status = data.get('status', t.status)
        t.energy = data.get('energy', t.energy)
        t.points = data.get('points', t.points)
        t.challenge_level = data.get('challenge_level', t.challenge_level)
        t.priority = data.get('priority', t.priority)
        t.cycle = data.get('cycle', t.cycle)
        t.start_date = data.get('start_date', t.start_date)
        t.end_date = data.get('end_date', t.end_date)
        t.active = data.get('active', t.active)
        t.project_id = data.get('project_id', t.project_id)
        t.parent_task_id = data.get('parent_task_id', t.parent_task_id)
        db.session.commit()
        return t

    def delete_task(self, task_id, user_id):
        t = self.get_task_by_id(task_id, user_id)
        t.deleted = True
        db.session.commit()

    def complete_task(self, task_id, user_id):
        t = self.get_task_by_id(task_id, user_id)
        if t.status == "COMPLETED":
            return t
        
        t.status = "COMPLETED"
        db.session.commit()

        # Cálculo de energía base
        base_energy = t.energy or 0

        # Verificar si user tiene double_energy_next_active
        user = User.query.filter_by(id=user_id, deleted=False).first()
        final_energy = base_energy

        if user.double_energy_next_active:
            final_energy *= 2
            # desactivamos para la siguiente
            user.double_energy_next_active = False

        # Verificar stackable_energy_active
        if user.stackable_energy_active:
            now = datetime.utcnow()
            if user.stackable_energy_expires and now <= user.stackable_energy_expires:
                # Aumenta la energía en +stackable_energy_count
                final_energy += user.stackable_energy_count
                # incrementamos la cuenta
                user.stackable_energy_count += 1
            else:
                # Se expiró, desactivar
                user.stackable_energy_active = False
                user.stackable_energy_count = 0

        # Log
        log_service.create_log(user_id, "TASK", t.id, final_energy)
        # Asignar la energía final al user (o sumársela)
        user.energy += final_energy

        # Cálculo de XP
        base_xp = t.points or 0
        xp_gained = base_xp

        # daily_first_completion_bonus => si active y no se ha usado HOY
        today = datetime.utcnow().date()
        if user.daily_first_completion_active:
            if user.daily_first_completion_date == today and not user.daily_first_completion_used:
                xp_gained *= 2
                user.daily_first_completion_used = True
            else:
                # Si la fecha guardada difiere del día actual, 
                # se expiró, reset (opcional) o dejas que el effect dure a perpetuidad.
                pass

        # double_rewards_week => si now <= user.double_rewards_until => xp*2 y coins*2
        now = datetime.utcnow()
        coins_gained = xp_gained  # en tu caso coins = xp
        if user.double_rewards_until and now <= user.double_rewards_until:
            xp_gained *= 2
            coins_gained *= 2

        # xp_multiplier => si now <= xp_multiplier_expires => multiplicar xp
        if user.xp_multiplier_expires and now <= user.xp_multiplier_expires:
            xp_gained = int(xp_gained * user.xp_multiplier)
        else:
            # si expiró, reset
            user.xp_multiplier = 1.0

        # Actualizar XP y coins
        user.xp += xp_gained
        user.coins += coins_gained

        db.session.commit()

        return t

    def get_overdue_tasks(self, user_id):
        """
        Devuelve las tareas cuyo end_date sea anterior a hoy y status != COMPLETED.
        """
        today = date.today()
        tasks = Task.query.filter(
            Task.user_id == user_id,
            Task.deleted == False,
            Task.status != "COMPLETED",
            Task.end_date != None,
            Task.end_date < today
        ).all()
        return tasks
    
    #Añadido nuevo con lo de los achievements globales.
    def mark_overdue_tasks(self, user_id):
        """
        Ejemplo: marca tareas como 'VENCIDAS' según su fecha.
        Podrías disparar un evento 'TASK_MARKED_OVERDUE' si deseas.
        """
        from datetime import date
        today = date.today()

        tasks = Task.query.filter_by(user_id=user_id, deleted=False).all()
        for t in tasks:
            if t.end_date and t.end_date < today and t.status == "PENDING":
                t.status = "VENCIDA"
        db.session.commit()

        # Luego, si quieres disparar la evaluación:
        from app.services.global_achievement_service import GlobalAchievementService
        global_ach_svc = GlobalAchievementService()
        global_ach_svc.evaluate_achievements(user_id, event="TASK_OVERDUE_CHECK", extra_data={})

        # Este 'extra_data' podría contener cuántas tareas se marcaron como vencidas, etc.
        return tasks
