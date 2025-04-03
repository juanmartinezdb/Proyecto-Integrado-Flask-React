# app/services/log_service.py
from app import db
from app.models.log_entry import LogEntry
from datetime import date

class LogService:

    def create_log(self, user_id, item_type, item_id, energy):
        """
        Crea un LogEntry con la energía, el día (sin hora) y 
        el tipo de ítem (TASK, HABIT, PROJECT, JOURNAL, etc.).
        """
        new_log = LogEntry(
            user_id=user_id,
            type=item_type,           # 'TASK', 'HABIT', 'PROJECT', 'JOURNAL', etc.
            item_id=item_id,
            end_timestamp=date.today(),  # guardamos solo la fecha
            energy=energy,
            deleted=False
        )
        db.session.add(new_log)
        db.session.commit()

        return new_log
