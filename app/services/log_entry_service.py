from app import db
from app.models.log_entry import LogEntry
from app.models.zone import Zone
from datetime import date, datetime, timedelta

class LogEntryService:

    def get_log_entries_filtered(self, user_id, log_type, zone_id, from_date, to_date):
        """
        Aplica filtros a la lista de log entries:
          - type => LogEntry.type
          - zone_id => LogEntry.zone_id
          - date range => end_timestamp
        """
        q = LogEntry.query.filter_by(user_id=user_id, deleted=False)

        if log_type:
            q = q.filter_by(type=log_type)

        if zone_id:
            q = q.filter_by(zone_id=zone_id)

        if from_date:
            try:
                d_from = datetime.strptime(from_date, "%Y-%m-%d").date()
                q = q.filter(LogEntry.end_timestamp >= d_from)
            except:
                pass

        if to_date:
            try:
                d_to = datetime.strptime(to_date, "%Y-%m-%d").date()
                q = q.filter(LogEntry.end_timestamp <= d_to)
            except:
                pass

        return q.all()

    def create_log_entry(self, data, user_id):
        zone_id = data.get('zone_id')
        if zone_id is not None:
            zone = Zone.query.filter_by(id=zone_id, deleted=False).first()
            if not zone:
                raise Exception("Zona no encontrada.")
            if zone.user_id != user_id:
                raise Exception("No tienes acceso a esa zona.")

        entry = LogEntry(
            challenge_level=data.get('challenge_level'),
            type=data.get('type'),
            item_id=data.get('item_id'),
            end_timestamp=data.get('end_timestamp', date.today()),
            energy=data.get('energy', 0),
            user_id=user_id,
            zone_id=zone_id,
            deleted=False
        )
        db.session.add(entry)
        db.session.commit()
        return entry

    def delete_log_entry(self, log_id, user_id):
        entry = LogEntry.query.filter_by(id=log_id, deleted=False).first()
        if not entry:
            raise Exception("LogEntry no encontrado.")
        if entry.user_id != user_id:
            raise Exception("No tienes acceso a este LogEntry.")
        entry.deleted = True
        db.session.commit()

    def get_log_summary(self, user_id, range_type, days_back):
        """
        Genera un resumen de la energía total por día o por semana en el intervalo especificado.
        range_type: 'daily' o 'weekly'
        days_back: cuántos días hacia atrás contar (por defecto 7 o 30, etc.)
        
        Retorna una lista de { "label": X, "total_energy": Y } 
        donde label puede ser la fecha o la semana representada.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days_back)
        
        # Obtener log entries en el rango
        logs = LogEntry.query.filter(
            LogEntry.user_id == user_id,
            LogEntry.deleted == False,
            LogEntry.end_timestamp >= start_date,
            LogEntry.end_timestamp <= end_date
        ).all()

        # Agrupar
        summary_map = {}  # clave = label, valor = total_energy
        if range_type == 'daily':
            for log in logs:
                d = log.end_timestamp.isoformat()
                summary_map[d] = summary_map.get(d, 0) + log.energy
            # Convertimos a lista
            summary_list = []
            for k in sorted(summary_map.keys()):  # ordenado por fecha
                summary_list.append({
                    "date": k,
                    "total_energy": summary_map[k]
                })
            return {"range_type": "daily", "data": summary_list}

        elif range_type == 'weekly':
            for log in logs:
                # Determinar la "semana del año"
                week_label = log.end_timestamp.isocalendar()[:2]  # (year, week_number)
                # o algo como "YYYY-WW"
                label_str = f"{week_label[0]}-W{week_label[1]}"
                summary_map[label_str] = summary_map.get(label_str, 0) + log.energy
            
            summary_list = []
            for k in sorted(summary_map.keys()):
                summary_list.append({
                    "week": k,
                    "total_energy": summary_map[k]
                })
            return {"range_type": "weekly", "data": summary_list}
        
        # si range_type no es daily o weekly, devolvemos daily por defecto
        return {"range_type": range_type, "data": []}
