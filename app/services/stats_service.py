from datetime import date, datetime, timedelta
from app import db
from app.models.log_entry import LogEntry
from app.models.user import User
from app.models.zone import Zone
from app.services.zone_service import ZoneService
zone_service = ZoneService()
class StatsService:
    def get_energy_balance_for_user(self, user_id):
        """
        Suma la energía de los LogEntries del usuario en los últimos 7 días.
        """
        start_date = date.today() - timedelta(days=7)
        logs = LogEntry.query.filter(
            LogEntry.user_id == user_id,
            LogEntry.deleted == False,
            LogEntry.end_timestamp >= start_date
        ).all()

        total_energy = sum(e.energy for e in logs)
        return total_energy

    def update_user_energy(self, user_id):
        """
        Llama a get_energy_balance_for_user() y asigna el resultado a user.energy.
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")

        total_energy = self.get_energy_balance_for_user(user_id)
        user.energy = total_energy
        db.session.commit()

        return total_energy

    def get_energy_balance_for_zone(self, zone_id):
        start_date = date.today() - timedelta(days=7)
        entries = LogEntry.query.filter(
            LogEntry.zone_id == zone_id,
            LogEntry.deleted == False,
            LogEntry.end_timestamp >= start_date
        ).all()
        total_energy = sum(e.energy for e in entries)
        return total_energy

    def update_zone_energy(self, zone_id, user_id):
        """
        Recalcula la energía de la zona en base a los log entries de la última semana.
        """
        zone = Zone.query.filter_by(id=zone_id, deleted=False).first()
        if not zone:
            raise Exception("Zona no encontrada")
        if zone.user_id != int(user_id):
            raise Exception("No tienes acceso a esta zona")

        total_energy = self.get_energy_balance_for_zone(zone_id)
        zone.energy = total_energy
        db.session.commit()
        return total_energy

    def get_user_stats(self, user_id):
        """
        Retorna un dict con las estadísticas del usuario.
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")
        stats = {
            "energy": user.energy,
            "xp": user.xp,
            "level": user.level,
            "points": user.points,
            "mana": user.mana,
            "login_streak": user.login_streak
        }
        return stats

    def get_zone_stats(self, zone_id, user_id):
        """
        Retorna un dict con las estadísticas de la zona.
        """
        zone = Zone.query.filter_by(id=zone_id, deleted=False).first()
        if not zone:
            raise Exception("Zona no encontrada")
        if zone.user_id != int(user_id):
            raise Exception("No tienes acceso a esta zona")

        stats = {
            "zone_id": zone.id,
            "name": zone.name,
            "energy": zone.energy,
            "xp": zone.xp,
            "level": zone.level
        }
        return stats

    def get_stats_history(self, user_id, stats_type, days_back):
        """
        Ejemplo: retorna un arreglo con la evolución diaria 
        del 'stats_type' (energy, xp, level, etc.) 
        en los últimos days_back días.
        
        Realmente la 'energy' se calcula de log_entries, 
        mientras xp/level deberías guardarlo en 
        un historial si quisieras ver su evolución. 
        Como no hay un 'user_history' implementado, 
        haremos un ejemplo con log_entries = daily energy.
        """
        if stats_type == 'energy':
            # Tomamos la sumatoria diaria de log_entries en los últimos days_back días
            end_date = date.today()
            start_date = end_date - timedelta(days=days_back)

            # Filtrar
            logs = LogEntry.query.filter(
                LogEntry.user_id == user_id,
                LogEntry.deleted == False,
                LogEntry.end_timestamp >= start_date,
                LogEntry.end_timestamp <= end_date
            ).all()

            # Agrupar por día
            daily_map = {}
            for l in logs:
                dstr = l.end_timestamp.isoformat()
                daily_map[dstr] = daily_map.get(dstr, 0) + l.energy
            
            # Crear lista ordenada
            result = []
            for i in range(days_back + 1):
                current_d = start_date + timedelta(days=i)
                cdstr = current_d.isoformat()
                e_val = daily_map.get(cdstr, 0)
                result.append({"date": cdstr, "energy": e_val})
            
            return {"type": "energy_history", "data": result}

        elif stats_type == 'xp':
            # Como ejemplo, devolvemos un valor fijo (no hay historial).
            # En un caso real, deberías tener tabla user_xp_history 
            # o algo similar.
            user = User.query.filter_by(id=user_id, deleted=False).first()
            if not user:
                raise Exception("Usuario no encontrado")
            return {
                "type": "xp_history",
                "data": [
                    {"date": (date.today() - timedelta(days=i)).isoformat(), "xp": user.xp}
                    for i in range(days_back + 1)
                ]
            }

        elif stats_type == 'level':
            # Similar a xp, devuelves algo fijo o generas un dummy.
            user = User.query.filter_by(id=user_id, deleted=False).first()
            if not user:
                raise Exception("Usuario no encontrado")
            return {
                "type": "level_history",
                "data": [
                    {"date": (date.today() - timedelta(days=i)).isoformat(), "level": user.level}
                    for i in range(days_back + 1)
                ]
            }

        else:
            # Tipo no soportado
            return {"type": stats_type, "data": []}
        
    def add_xp_and_coins_to_user(self, user_id, xp_gained, coins_gained):
        """
        Suma xp y monedas al usuario; chequea si sube de nivel => +1 gema azul
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")

        # Sumar xp
        user.xp += xp_gained
        # Sumar monedas
        user.coins += coins_gained

        # Chequeamos subida de nivel en bucle (por si gana mucho xp de golpe)
        level_up = False
        while user.xp >= xp_needed_for_level(user.level + 1):
            user.level += 1
            level_up = True
            # Al subir de nivel => +1 gema azul
            user.blue_gems += 1

        db.session.commit()

        return {
            "user_level": user.level,
            "user_xp": user.xp,
            "coins": user.coins,
            "blue_gems": user.blue_gems,
            "level_up": level_up
        }

def xp_needed_for_level(level):
    """
    Lógica de cuánta XP se requiere para cada nivel del user.
    Aquí un ejemplo lineal: 100 * level.
    """
    return 100 * level
