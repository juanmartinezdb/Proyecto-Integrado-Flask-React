from app import db
from app.models.effect import Effect
from app.models.user import User
from datetime import datetime, timedelta
import json

class EffectService:

    def get_all_effects(self):
        return Effect.query.filter_by(deleted=False).all()

    def get_by_id(self, effect_id):
        eff = Effect.query.filter_by(id=effect_id, deleted=False).first()
        if not eff:
            raise Exception("Effect no encontrado")
        return eff

    def create_effect(self, data):
        eff = Effect(
            name=data.get('name'),
            logic_key=data.get('logic_key'),
            description=data.get('description'),
            type=data.get('type'),
            target_entities=data.get('target_entities'),
            deleted=False
        )
        db.session.add(eff)
        db.session.commit()
        return eff

    def update_effect(self, effect_id, data):
        eff = self.get_by_id(effect_id)
        eff.name = data.get('name', eff.name)
        eff.logic_key = data.get('logic_key', eff.logic_key)
        eff.description = data.get('description', eff.description)
        eff.type = data.get('type', eff.type)
        eff.target_entities = data.get('target_entities', eff.target_entities)
        db.session.commit()
        return eff

    def delete_effect(self, effect_id):
        eff = self.get_by_id(effect_id)
        eff.deleted = True
        db.session.commit()

    def apply_effect(effect, user, context=None):
        """
        Aplica la lógica de un 'Effect' a un 'User'. 
        'effect' es la instancia de la BD (contiene logic_key, etc.)
        'user' es la instancia del User al que se aplica
        'context' es un dict opcional con datos extra (ej. "habit_id", "zone_id", etc.)
        """
        if context is None:
            context = {}

        logic_key = effect.logic_key
        func = EFFECT_LOGIC_MAP.get(logic_key)
        if not func:
            raise Exception(f"No se ha definido lógica para el effect.logic_key={logic_key}")
        func(user, context)

        # ----------------------- LÓGICA DE CADA EFFECT ------------------------

def _apply_energy_boost(user, context):
    user.energy += 10
    db.session.commit()

def _apply_energy_reduction(user, context):
    user.energy -= 15
    db.session.commit()

def _apply_double_energy_next(user, context):
    # Activa la bandera que duplicará la energía en la siguiente tarea/hábito
    user.double_energy_next_active = True
    db.session.commit()

def _apply_xp_multiplier_daily(user, context):
    # Multiplica la XP en 1.5 hasta hoy a las 23:59 (o 24h)
    now = datetime.utcnow()
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    user.xp_multiplier = 1.5
    user.xp_multiplier_expires = end_of_day
    db.session.commit()

def _apply_discount_store(user, context):
    user.store_discount_active = True
    user.store_discount_value = 0.2  # 20%
    db.session.commit()

def _apply_habit_autocomplete(user, context):
    from app.models.habit import Habit
    habit_id = context.get("habit_id")
    if not habit_id:
        raise Exception("No se proporcionó habit_id en context para habit_autocomplete")

    habit = Habit.query.filter_by(id=habit_id, user_id=user.id, deleted=False).first()
    if not habit:
        raise Exception("Hábito no encontrado o no pertenece al usuario")
    # Marcamos como completado
    habit.streak += 1
    habit.total_check += 1
    db.session.commit()
    # Podrías invocar log_service, xp, etc., si fuese coherente con tu HabitService.

def _apply_project_energy_boost(user, context):
    from app.models.project import Project
    projects = Project.query.filter_by(user_id=user.id, deleted=False, status="ACTIVE").all()
    for p in projects:
        if p.energy is None:
            p.energy = 0
        p.energy += 10
    db.session.commit()

def _apply_skip_penalty(user, context):
    # Anula penalizaciones hasta el final del día
    now = datetime.utcnow()
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    user.skip_penalty_active = True
    user.skip_penalty_expires = end_of_day
    db.session.commit()

def _apply_skip_penalty_user(user, context):
    # Restaura la racha de login en 1. (o a su valor anterior si lo guardaste)
    user.login_streak += 1
    db.session.commit()

def _apply_shield_energy_loss(user, context):
    user.shield_energy_loss_until = datetime.utcnow() + timedelta(days=3)
    db.session.commit()

def _apply_double_rewards_week(user, context):
    user.double_rewards_until = datetime.utcnow() + timedelta(days=7)
    db.session.commit()

def _apply_zone_energy_protection(user, context):
    """
    Reduce 50% la pérdida de energía en 'zone_id' por 7 días.
    Guardamos la info en user.zone_effects_json => 'energy_protection'
    """
    zone_id = context.get("zone_id")
    if not zone_id:
        raise Exception("No se indicó zone_id en context para zone_energy_protection.")
    data = {}
    if user.zone_effects_json:
        data = json.loads(user.zone_effects_json)
    if "energy_protection" not in data:
        data["energy_protection"] = {}
    data["energy_protection"][str(zone_id)] = {
        "expires": (datetime.utcnow() + timedelta(days=7)).isoformat(),
        "value": 0.5
    }
    user.zone_effects_json = json.dumps(data)
    db.session.commit()

def _apply_coin_multiplier_zone(user, context):
    """
    25% más monedas en la zona dada, guardado en zone_effects_json => 'coin_multiplier'
    """
    zone_id = context.get("zone_id")
    if not zone_id:
        raise Exception("No se indicó zone_id en context para coin_multiplier_zone.")
    data = {}
    if user.zone_effects_json:
        data = json.loads(user.zone_effects_json)
    if "coin_multiplier" not in data:
        data["coin_multiplier"] = {}
    data["coin_multiplier"][str(zone_id)] = {
        "expires": (datetime.utcnow() + timedelta(days=7)).isoformat(),
        "value": 1.25
    }
    user.zone_effects_json = json.dumps(data)
    db.session.commit()

def _apply_gear_auto_repair(user, context):
    from app.models.inventory_item import InventoryItem
    from app.models.gear import Gear
    gear_id = context.get("gear_id")
    if not gear_id:
        raise Exception("No se indicó gear_id para gear_auto_repair.")
    item = InventoryItem.query.filter_by(gear_id=gear_id, user_id=user.id, deleted=False).first()
    if not item:
        raise Exception("No se encontró ese ítem en tu inventario.")
    gear = Gear.query.filter_by(id=gear_id, deleted=False).first()
    if gear and gear.max_uses is not None:
        item.remaining_uses = gear.max_uses
        db.session.commit()

def _apply_no_habit_loss_weekend(user, context):
    """
    No perder rachas de hábitos el fin de semana. 
    Activamos un flag hasta 7 días después
    (o solo hasta el siguiente fin de semana, ajusta a tu gusto).
    """
    user.no_habit_loss_weekend_expires = datetime.utcnow() + timedelta(days=7)
    db.session.commit()

def _apply_stackable_energy_bonus(user, context):
    """
    Cada vez que completes un hábito, +1 de energía acumulativa
    durante 12h. Se reinicia si fallas uno.
    """
    user.stackable_energy_active = True
    user.stackable_energy_expires = datetime.utcnow() + timedelta(hours=12)
    user.stackable_energy_count = 0  # empieza en 0, se incrementará al completar cada hábito
    db.session.commit()

def _apply_daily_first_completion_bonus(user, context):
    """
    La 1ra tarea/hábito/proyecto completado cada día otorga doble recompensas.
    Lo activamos con daily_first_completion_active = True,
    y reseteamos la fecha actual.
    """
    user.daily_first_completion_active = True
    user.daily_first_completion_date = datetime.utcnow().date()
    user.daily_first_completion_used = False
    db.session.commit()

def _apply_placebo(user, context):
    # No hace nada real
    pass

# ----------------------------------------------------------------------
# Mapeo final
# ----------------------------------------------------------------------
EFFECT_LOGIC_MAP = {
    "energy_boost": _apply_energy_boost,
    "energy_reduction": _apply_energy_reduction,
    "double_energy_next": _apply_double_energy_next,
    "xp_multiplier_daily": _apply_xp_multiplier_daily,
    "discount_store": _apply_discount_store,
    "habit_autocomplete": _apply_habit_autocomplete,
    "project_energy_boost": _apply_project_energy_boost,
    "skip_penalty": _apply_skip_penalty,
    "skip_penalty_user": _apply_skip_penalty_user,
    "shield_energy_loss": _apply_shield_energy_loss,
    "double_rewards_week": _apply_double_rewards_week,
    "zone_energy_protection": _apply_zone_energy_protection,
    "coin_multiplier_zone": _apply_coin_multiplier_zone,
    "gear_auto_repair": _apply_gear_auto_repair,
    "no_habit_loss_weekend": _apply_no_habit_loss_weekend,
    "stackable_energy_bonus": _apply_stackable_energy_bonus,
    "daily_first_completion_bonus": _apply_daily_first_completion_bonus,
    "placebo": _apply_placebo
}