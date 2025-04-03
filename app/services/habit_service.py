from app import db
from app.models.user import User
from app.models.habit import Habit
from app.models.zone import Zone
from app.models.effect import Effect
from datetime import datetime, date
from app.services.log_service import LogService
from app.services.stats_service import StatsService
from app.services.zone_service import ZoneService
zone_service = ZoneService()
log_service = LogService()
stats_service = StatsService()

class HabitService:

    def get_habits_with_filters(self, user_id, active=None, frequency=None,
                                min_energy=None, max_energy=None,
                                start_date=None, end_date=None,
                                energy_type=None, page=None, limit=None):
        """
        Aplica filtros sobre la tabla Habit. Todos los parámetros son opcionales.
        Incluye paginación y filtro por energía positiva/negativa.
        """
        query = Habit.query.filter_by(user_id=user_id, deleted=False)

        if active is not None:
            is_active = active.lower() == 'true'
            query = query.filter_by(active=is_active)

        if frequency:
            query = query.filter_by(frequency=frequency)

        if min_energy:
            query = query.filter(Habit.energy >= int(min_energy))

        if max_energy:
            query = query.filter(Habit.energy <= int(max_energy))

        # Filtro por energía positiva/negativa
        if energy_type == "positive":
            query = query.filter(Habit.energy >= 0)
        elif energy_type == "negative":
            query = query.filter(Habit.energy < 0)

        # Si tuvieras created_at:
        # if start_date:
        #     try:
        #         start = datetime.strptime(start_date, "%Y-%m-%d").date()
        #         query = query.filter(Habit.created_at >= start)
        #     except:
        #         pass
        # if end_date:
        #     try:
        #         end = datetime.strptime(end_date, "%Y-%m-%d").date()
        #         query = query.filter(Habit.created_at <= end)
        #     except:
        #         pass

        total = query.count()

        # Paginación
        if page and limit:
            try:
                page = int(page)
                limit = int(limit)
            except:
                page = 1
                limit = 10

            offset = (page - 1) * limit
            query = query.offset(offset).limit(limit)

        habits = query.all()

        return habits, total

    def get_habit_by_id(self, habit_id, user_id):
        h = Habit.query.filter_by(id=habit_id, deleted=False).first()
        if not h:
            raise Exception("Hábito no encontrado.")
        if h.user_id != int(user_id):
            raise Exception("No tienes acceso a este hábito.")
        return h

    def create_habit(self, data, user_id):
        zone_id = data.get('zone_id')
        effect_id = data.get('effect_id')

        z = None
        if zone_id:
            z = Zone.query.filter_by(id=zone_id, deleted=False).first()
            if not z:
                raise Exception("Zona no encontrada.")
            if z.user_id != user_id:
                raise Exception("No tienes acceso a esta zona.")

        eff = None
        if effect_id:
            eff = Effect.query.filter_by(id=effect_id, deleted=False).first()
            if not eff:
                raise Exception("Efecto no encontrado.")

        habit = Habit(
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            active=data.get('active', True),
            energy=data.get('energy', 0),
            points=data.get('points', 0),
            frequency=data.get('frequency', 'DAILY'),
            streak=0,
            total_check=0,
            challenge_level=data.get('challenge_level'),
            zone_id=z.id if z else None,
            effect_id=eff.id if eff else None,
            user_id=user_id,
            deleted=False
        )
        db.session.add(habit)
        db.session.commit()
        return habit

    def update_habit(self, habit_id, data, user_id):
        h = self.get_habit_by_id(habit_id, user_id)

        if 'name' in data:
            h.name = data['name']
        if 'description' in data:
            h.description = data['description']
        if 'image' in data:
            h.image = data['image']
        if 'active' in data:
            h.active = data['active']
        if 'energy' in data:
            h.energy = data['energy']
        if 'points' in data:
            h.points = data['points']
        if 'frequency' in data:
            h.frequency = data['frequency']
        if 'challenge_level' in data:
            h.challenge_level = data['challenge_level']

        zone_id = data.get('zone_id')
        if zone_id is not None:
            if zone_id == 0:
                h.zone_id = None
            else:
                z = Zone.query.filter_by(id=zone_id, deleted=False).first()
                if not z:
                    raise Exception("Zona no encontrada.")
                if z.user_id != user_id:
                    raise Exception("No tienes acceso a esta zona.")
                h.zone_id = z.id

        effect_id = data.get('effect_id')
        if effect_id is not None:
            if effect_id == 0:
                h.effect_id = None
            else:
                eff = Effect.query.filter_by(id=effect_id, deleted=False).first()
                if not eff:
                    raise Exception("Efecto no encontrado.")
                h.effect_id = eff.id

        db.session.commit()
        return h

    def delete_habit(self, habit_id, user_id):
        """
        Borrado lógico de un hábito, con posible disparo de evento para logros globales.
        """
        h = self.get_habit_by_id(habit_id, user_id)
        from datetime import datetime
        deletion_time = datetime.now()

        h.deleted = True
        db.session.commit()

        # NUEVO: Disparamos la evaluación de logros
        from app.services.global_achievement_service import GlobalAchievementService
        global_ach_svc = GlobalAchievementService()

        extra_data = {
            "habit_id": h.id,
            "deletion_time": deletion_time
        }
        global_ach_svc.evaluate_achievements(user_id, event="HABIT_DELETED", extra_data=extra_data)

        return h


    def complete_habit(self, habit_id, user_id):
        h = self.get_habit_by_id(habit_id, user_id)
        h.streak += 1
        h.total_check += 1
        db.session.commit()

        user = User.query.filter_by(id=user_id, deleted=False).first()

        # Cálculo de energía base
        base_energy = h.energy or 0
        final_energy = base_energy

        # double_energy_next
        if user.double_energy_next_active:
            final_energy *= 2
            user.double_energy_next_active = False

        # stackable_energy_bonus
        now = datetime.utcnow()
        if user.stackable_energy_active:
            if user.stackable_energy_expires and now <= user.stackable_energy_expires:
                final_energy += user.stackable_energy_count
                user.stackable_energy_count += 1
            else:
                user.stackable_energy_active = False
                user.stackable_energy_count = 0

        # Log
        log_service.create_log(user_id, "HABIT", h.id, final_energy)
        user.energy += final_energy

        # Cálculo XP
        base_xp = h.points or 0
        xp_gained = base_xp
        coins_gained = xp_gained

        # daily_first_completion_bonus
        today = datetime.utcnow().date()
        if user.daily_first_completion_active:
            if user.daily_first_completion_date == today and not user.daily_first_completion_used:
                xp_gained *= 2
                coins_gained *= 2
                user.daily_first_completion_used = True
        
        # double_rewards_week
        if user.double_rewards_until and now <= user.double_rewards_until:
            xp_gained *= 2
            coins_gained *= 2

        # xp_multiplier_daily
        if user.xp_multiplier_expires and now <= user.xp_multiplier_expires:
            xp_gained = int(xp_gained * user.xp_multiplier)
        
        # Actualizar XP y coins
        user.xp += xp_gained
        user.coins += coins_gained

        db.session.commit()

        return h
    

    def get_habit_streak(self, habit_id, user_id):
        """
        Devuelve la racha actual (streak) y el total_check.
        """
        h = self.get_habit_by_id(habit_id, user_id)
        return {
            "habit_id": h.id,
            "streak": h.streak,
            "total_check": h.total_check
        }

    def get_habit_stats(self, habit_id, user_id, from_date, to_date):
        """
        Ejemplo de conteo de cuántas veces se completó el hábito en un rango de fechas.
        Como no hay tabla intermedia con registros de cada "compleción", 
        por ahora asumimos total_check sube cada vez que 'complete_habit' es llamado,
        sin almacenar la fecha exacta de cada 'check'.
        
        Si tuvieras un LogEntry con type="HABIT", 
        podrías filtrar esos log entries por fecha y contar.
        """
        h = self.get_habit_by_id(habit_id, user_id)
        # Modo simple: devolvemos la racha y el total check global
        stats = {
            "streak": h.streak,
            "total_check": h.total_check
        }
        # Si tuvieras un log, podrías hacer algo como:
        # count = LogEntry.query.filter(
        #     LogEntry.type == "HABIT",
        #     LogEntry.item_id == habit_id,
        #     LogEntry.user_id == user_id,
        #     ...
        # ).count()
        # stats["completions_in_range"] = count

        return stats
    
    def fail_habit(self, habit_id, user_id):
        """
        Lógica de fallo de hábito, restando energía o penalizando streak.
        """
        h = self.get_habit_by_id(habit_id, user_id)
        user = User.query.filter_by(id=user_id, deleted=False).first()

        # Si skip_penalty_active y no ha expirado
        now = datetime.utcnow()
        if user.skip_penalty_active and user.skip_penalty_expires and now <= user.skip_penalty_expires:
            # se anula la penalización, desactivamos
            user.skip_penalty_active = False
            user.skip_penalty_expires = None
            db.session.commit()
            return h  # sin penalizar
        
        # Sino, penalizamos
        # shield_energy_loss => no restar energía negativa
        energy_loss = 10
        if user.shield_energy_loss_until and now <= user.shield_energy_loss_until:
            energy_loss = 0  # no pierde

        user.energy -= energy_loss
        # romper streak
        h.streak = 0
        db.session.commit()
        return h
