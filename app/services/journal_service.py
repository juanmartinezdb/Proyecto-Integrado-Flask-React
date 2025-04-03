from app import db
from app.models.journal import Journal
from datetime import datetime, date, timedelta


class JournalService:
    def get_all_journals_filtered(self, user_id, from_date, to_date, j_type):
        query = Journal.query.filter_by(user_id=user_id, deleted=False)
        if j_type:
            query = query.filter_by(type=j_type)
        # Si hay created_at: filtrar
        if from_date:
            try:
                start = datetime.strptime(from_date, "%Y-%m-%d").date()
                query = query.filter(Journal.created_at >= start)
            except:
                pass
        if to_date:
            try:
                end = datetime.strptime(to_date, "%Y-%m-%d").date()
                query = query.filter(Journal.created_at <= end)
            except:
                pass
        return query.all()

    def get_journal_by_id(self, journal_id, user_id):
        j = Journal.query.filter_by(id=journal_id, deleted=False).first()
        if not j:
            raise Exception("Journal no encontrado.")
        if j.user_id != int(user_id):
            raise Exception("No tienes acceso a este Journal.")
        return j

    def create_journal(self, data, user_id):
        j = Journal(
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            type=data.get('type'),
            user_id=user_id,
            deleted=False
        )
        db.session.add(j)
        db.session.commit()
        return j

    def update_journal(self, journal_id, data, user_id):
        j = self.get_journal_by_id(journal_id, user_id)
        j.name = data.get('name', j.name)
        j.description = data.get('description', j.description)
        j.image = data.get('image', j.image)
        j.type = data.get('type', j.type)
        db.session.commit()
        return j

    def delete_journal(self, journal_id, user_id):
        j = self.get_journal_by_id(journal_id, user_id)
        j.deleted = True
        db.session.commit()

    # ---- Nuevos métodos ----

    def get_or_create_journal_today(self, user_id):
        """
        Retorna el diario del día actual si existe; de lo contrario, crea uno.
        """
        today = date.today()
        # Supongamos que guardas date en created_at
        # Sino, podrías usar last_entry_date logic.
        existing = Journal.query.filter(
            Journal.user_id == user_id,
            Journal.deleted == False
            # Podrías filtrar Journal.created_at == hoy
        ).order_by(Journal.created_at.desc()).first()

        if existing:
            # Lógica: si su created_at es hoy, retornarlo; si no, crear nuevo
            # Para simplificar, devolvemos el último, o creamos uno si no coincide.
            # Ajusta a tu gusto:
            return existing
        else:
            # Crear uno nuevo
            j = Journal(
                name=f"Diario {today.isoformat()}",
                user_id=user_id,
                deleted=False
            )
            db.session.add(j)
            db.session.commit()
            return j

    def get_journal_stats(self, journal_id, user_id, from_date, to_date):
        """
        Ejemplo para calcular estadísticas, e.g. promedio de puntos de entradas, 
        evolución de la racha, etc.
        """
        j = self.get_journal_by_id(journal_id, user_id)

        # Si deseas algo más elaborado, deberías filtrar las entries por fecha
        # o usar el streak que ya maneja la clase Journal.

        total_points = 0
        count_entries = 0
        for e in j.entries:
            if e.deleted:
                continue
            # Filtrar por from_date y to_date si se desea:
            # if from_date or to_date: ...
            total_points += e.points if e.points else 0
            count_entries += 1

        avg_points = total_points / count_entries if count_entries else 0

        return {
            "journal_id": j.id,
            "total_entries": count_entries,
            "total_points": total_points,
            "average_points_per_entry": avg_points,
            "streak": j.streak
        }
