from app import db
from app.models.global_achievement import GlobalAchievement
from app.models.user_global_achievement import UserGlobalAchievement
from app.models.user import User
from datetime import datetime

class GlobalAchievementService:

    def get_by_id(self, ach_id):
        return GlobalAchievement.query.filter_by(id=ach_id, deleted=False).first()

    def create_global_achievement(self, data):
        ach = GlobalAchievement(
            name=data.get('name'),
            description=data.get('description'),
            condition_type=data.get('condition_type', 'SURPRISE'),
            threshold=data.get('threshold', 0),
            honorific_title=data.get('honorific_title'),
            is_surprise=data.get('is_surprise', False),
            deleted=False
        )
        db.session.add(ach)
        db.session.commit()
        return ach

    def update_global_achievement(self, ach_id, data):
        ach = self.get_by_id(ach_id)
        if not ach:
            raise Exception("Logro global no encontrado.")

        ach.name = data.get('name', ach.name)
        ach.description = data.get('description', ach.description)
        ach.condition_type = data.get('condition_type', ach.condition_type)
        ach.threshold = data.get('threshold', ach.threshold)
        ach.honorific_title = data.get('honorific_title', ach.honorific_title)
        ach.is_surprise = data.get('is_surprise', ach.is_surprise)
        db.session.commit()
        return ach

    def delete_global_achievement(self, ach_id):
        ach = self.get_by_id(ach_id)
        if not ach:
            raise Exception("Logro global no encontrado.")
        ach.deleted = True
        db.session.commit()

    def list_global_achievements(self, only_active=True):
        q = GlobalAchievement.query
        if only_active:
            q = q.filter_by(deleted=False)
        return q.all()

    # ---------------------------------------------------------------------
    #                 FUNCIONES DE EVALUACIÓN DE LOGROS
    # ---------------------------------------------------------------------

    def evaluate_achievements(self, user_id, event, extra_data=None):
        """
        Punto de entrada principal para evaluar si, dado un 'evento'
        (p.ej., 'TASK_COMPLETED', 'USER_LOGIN', 'HABIT_COMPLETED', etc.)
        el usuario ha desbloqueado algún logro global.
        
        - event: string que describe el suceso.
        - extra_data: dict con datos relevantes (e.g. {'task_id': 123})
        """
        if extra_data is None:
            extra_data = {}

        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            return  # O lanza excepción

        # 1) Obtener todos los logros globales que puedan aplicar (p.ej., los que no estén borrados).
        global_achievements = GlobalAchievement.query.filter_by(deleted=False).all()
        
        for ga in global_achievements:
            # 2) Revisar si el usuario ya tiene este logro
            already_unlocked = UserGlobalAchievement.query.filter_by(
                user_id=user_id,
                global_achievement_id=ga.id,
                deleted=False
            ).first()

            if already_unlocked:
                # El usuario ya lo tiene, no hay que reevaluar
                continue

            # 3) Según condition_type, calcular si el usuario cumple la condición
            if self._check_condition_met(user, ga, event, extra_data):
                # 4) Otorgar el logro
                new_user_ach = UserGlobalAchievement(
                    user_id=user.id,
                    global_achievement_id=ga.id,
                    achieved_at=datetime.utcnow(),
                    current_progress=ga.threshold  # O el valor exacto que tengas
                )
                db.session.add(new_user_ach)

                # (Opcional) si quieres darle al user un “title” activo
                # user.honorific_title = ga.honorific_title
                db.session.commit()

                # Podrías disparar una notificación, etc.

    def _check_condition_met(self, user, ga, event, extra_data):
        """
        Determina si el usuario cumple la condición del logro global 'ga'.
        Lógica centralizada en sub-funciones específicas.
        """
        cond_type = ga.condition_type

        # Por simplicidad, muchas "sorpresas" encajarán en la categoría SURPRISE,
        # y se verifica la lógica según el evento o la data.
        if cond_type == "TASKS_COMPLETED":
            return self._check_tasks_completed(user, ga, event, extra_data)
        elif cond_type == "HABIT_STREAK":
            return self._check_habit_streak(user, ga, event, extra_data)
        elif cond_type == "LOGIN_STREAK":
            return self._check_login_streak(user, ga, event, extra_data)
        elif cond_type == "SURPRISE":
            return self._check_surprise_achievements(user, ga, event, extra_data)
        # ... etc. Agrega más handlers según necesites
        return False

    def _check_tasks_completed(self, user, ga, event, extra_data):
        """
        Ejemplo: “alcanzar X tareas completadas”
        - Se evalúa cuando event == 'TASK_COMPLETED'
        - Contamos cuántas tareas completadas lleva el usuario en total.
        """
        if event != 'TASK_COMPLETED':
            return False
        # count tasks completadas => ver tu Task model
        from app.models.task import Task
        completed_count = Task.query.filter_by(
            user_id=user.id,
            status="COMPLETED",
            deleted=False
        ).count()

        return completed_count >= ga.threshold

    def _check_habit_streak(self, user, ga, event, extra_data):
        """
        Ejemplo: “mantener una racha de un hábito durante X días”.
        - Se evalúa en event == 'HABIT_COMPLETED' o algo similar.
        - Verifica si el streak del hábito >= threshold
        """
        if event != 'HABIT_COMPLETED':
            return False
        # Aquí podrías usar un habit_id en extra_data
        from app.models.habit import Habit
        habit_id = extra_data.get('habit_id')
        if not habit_id:
            return False
        habit = Habit.query.filter_by(id=habit_id, deleted=False).first()
        if not habit or habit.user_id != user.id:
            return False
        
        # Comparamos la racha
        return habit.streak >= ga.threshold

    def _check_login_streak(self, user, ga, event, extra_data):
        """
        Lógica para “hacer login varios días seguidos” (p.ej. 7).
        Podrías llevar un campo user.login_streak en la tabla, 
        o registrar un LogEntry para cada login y calcularlo.
        """
        if event != 'USER_LOGIN':
            return False
        # Supongamos que ya tienes un campo user.login_streak que incrementas 
        # cada día consecutivo que hace login, y reseteas si se rompe la racha.
        return user.login_streak >= ga.threshold

    def _check_surprise_achievements(self, user, ga, event, extra_data):
        """
        Aquí engloba la lógica de los “logros sorpresa”:
        - "El Búho Productivo" => Tarea completada entre 00:00 y 05:00
        - "El Domingo No Se Trabaja" => Tarea completada un domingo
        - "Milagro de Año Nuevo" => 1 de enero
        - "La Tarea Fantasma" => completar en menos de 1 minuto
        - etc.
        """
        # Podemos hacer un if/elif grande según el event y la data.
        # Como hay muchos ejemplos, demostramos la idea para 2-3 casos:
        import datetime

        if event == 'TASK_COMPLETED':
            # Ver si se completó de madrugada
            completion_time = extra_data.get('completion_time')  # Debes pasarlo
            if completion_time:
                hour = completion_time.hour
                # "El Búho Productivo" => [00:00 - 05:00)
                if hour >= 0 and hour < 5:
                    if ga.name == "El Búho Productivo":
                        return True

            # Ver si es domingo
            day_of_week = completion_time.weekday()  # lunes=0 ... domingo=6
            if day_of_week == 6:  # 6 => domingo
                if ga.name == "El Domingo No Se Trabaja":
                    return True

            # Otras lógicas “fantasma”, etc.
            # if ga.name == "La Tarea Fantasma": ...
            #   Chequear data de creación vs completion_time < 1 min

        elif event == 'USER_LOGIN':
            # "Milagro de Año Nuevo"
            now = datetime.datetime.utcnow()
            if now.month == 1 and now.day == 1:
                if ga.name == "Milagro de Año Nuevo":
                    # Además, para “completar al menos una tarea en año nuevo” 
                    # deberías esperar la acción de la tarea => o subdividir la 
                    # lógica. Depende de tu preferencia.
                    return True

        # etc. => más condiciones para distintos logros sorpresa
        return False
