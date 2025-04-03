from app import db
from app.models.journal import Journal
from app.models.journal_entry import JournalEntry
from datetime import date, timedelta
from app.services.log_service import LogService
from app.services.stats_service import StatsService

log_service = LogService()
stats_service = StatsService()

class JournalEntryService:
    def get_entries_by_journal(self, journal_id, user_id):
        journal = Journal.query.filter_by(id=journal_id, deleted=False).first()
        if not journal:
            raise Exception("Journal no encontrado.")
        if journal.user_id != int(user_id):
            raise Exception("No tienes acceso a este Journal.")
        # Filtramos las entradas no borradas
        return [entry for entry in journal.entries if not entry.deleted]

    def get_entry_by_id(self, entry_id, user_id):
        entry = JournalEntry.query.filter_by(id=entry_id, deleted=False).first()
        if not entry:
            raise Exception("Entrada de diario no encontrada.")
        if entry.user_id != int(user_id):
            raise Exception("No tienes acceso a esta entrada.")
        return entry

    def create_entry(self, journal_id, data, user_id):
        """
        Crea una nueva entrada de diario, actualiza la racha del Journal 
        y evalúa logros globales.
        """
        journal = Journal.query.filter_by(id=journal_id, deleted=False).first()
        if not journal:
            raise Exception("Journal no encontrado.")
        if journal.user_id != int(user_id):
            raise Exception("No tienes acceso a este Journal.")

        today = date.today()

        # Lógica racha
        if journal.last_entry_date == today:
            pass  # ya había una entrada hoy
        elif journal.last_entry_date and (journal.last_entry_date + timedelta(days=1) == today):
            journal.streak += 1
        else:
            journal.streak = 1

        journal.last_entry_date = today

        entry = JournalEntry(
            edited_at=today,
            content=data.get('content'),
            points=data.get('points', 0),
            energy=data.get('energy', 0),
            journal_id=journal.id,
            user_id=user_id,
            deleted=False
        )
        db.session.add(entry)
        db.session.commit()

        log_service.create_log(user_id, "JOURNAL_ENTRY", entry.id, entry.energy)
        stats_service.update_user_energy(user_id)

        # NUEVO: Disparamos la evaluación de logros
        from app.services.global_achievement_service import GlobalAchievementService
        global_ach_svc = GlobalAchievementService()

        extra_data = {
            "journal_id": journal.id,
            "entry_id": entry.id,
            "entry_date": today
        }
        global_ach_svc.evaluate_achievements(user_id, event="JOURNAL_ENTRY_CREATED", extra_data=extra_data)

        return entry


    def update_entry(self, entry_id, data, user_id):
        entry = self.get_entry_by_id(entry_id, user_id)
        entry.content = data.get('content', entry.content)
        entry.points = data.get('points', entry.points)
        entry.edited_at = date.today()
        db.session.commit()
        return entry

    def delete_entry(self, entry_id, user_id):
        entry = self.get_entry_by_id(entry_id, user_id)
        entry.deleted = True
        db.session.commit()
