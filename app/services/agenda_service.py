from datetime import datetime, timedelta, date
from app.models.task import Task
from app.models.habit import Habit
from app.models.project import Project
from app.models.zone import Zone

class AgendaService:
    def get_agenda_data(self, user_id, period, ref_date_str, zone_id, included_types):
        """
        Combina tareas, hábitos y proyectos según los parámetros.
        - period: "daily", "weekly", "monthly"
        - ref_date_str: fecha de referencia ("YYYY-MM-DD"); si None, usar hoy
        - zone_id: filtra objetos asociados a una zona específica (si se desea)
        - included_types: lista con "task", "habit", "project"

        Retorna un dict con la información consolidada:
        {
          "period": "weekly",
          "start_date": ...,
          "end_date": ...,
          "items": [
              {
                  "type": "task",
                  "id": ...,
                  "name": ...,
                  "start_date": ...,
                  "end_date": ...,
                  "zone_id": ...
              },
              ...
          ]
        }
        """
        # 1) Determinar start_date y end_date según period
        today = date.today()
        if ref_date_str:
            try:
                ref_date = datetime.strptime(ref_date_str, "%Y-%m-%d").date()
            except ValueError:
                ref_date = today
        else:
            ref_date = today

        if period == 'weekly':
            # supongamos que la "semana" inicia en ref_date (lunes, etc.)
            start_date = ref_date
            end_date = ref_date + timedelta(days=6)
        elif period == 'monthly':
            # mes completo a partir del 1 del mes de ref_date
            start_date = ref_date.replace(day=1)
            # día 1 + 30 días (aprox, no calculamos meses de 28/29/31 exacto)
            end_date = start_date + timedelta(days=30)
        else:
            # daily por defecto
            start_date = ref_date
            end_date = ref_date

        # 2) Recolectar items
        items = []

        # TAREAS
        if 'task' in included_types:
            q_task = Task.query.filter_by(user_id=user_id, deleted=False)
            # Filtro por fecha (si la tarea tiene start_date/end_date):
            q_task = q_task.filter(Task.end_date >= start_date, Task.start_date <= end_date)
            if zone_id:
                # Filtramos por tasks que estén en un proyecto con zone_id
                q_task = q_task.join(Project).filter(Project.zone_id == zone_id)

            tasks = q_task.all()
            for t in tasks:
                items.append({
                    "type": "task",
                    "id": t.id,
                    "name": t.name,
                    "status": t.status,
                    "start_date": str(t.start_date) if t.start_date else None,
                    "end_date": str(t.end_date) if t.end_date else None,
                    "zone_id": t.project.zone_id if t.project else None
                })

        # HÁBITOS
        if 'habit' in included_types:
            q_habit = Habit.query.filter_by(user_id=user_id, deleted=False)
            # No siempre un hábito tiene start_date / end_date.
            # Para la agenda, supondremos que "siempre" aplica, 
            # o podríamos filtrar si hay un campo "created_at" / "someDate".
            if zone_id:
                q_habit = q_habit.filter_by(zone_id=zone_id)
            habits = q_habit.all()
            # Asumimos que en una vista "weekly", 
            # se mostrará el hábito cada día del rango, 
            # o una vez, etc. Esto depende de la lógica.
            for h in habits:
                items.append({
                    "type": "habit",
                    "id": h.id,
                    "name": h.name,
                    "frequency": h.frequency,
                    "zone_id": h.zone_id,
                    # Podríamos expandir "proyección" de los días en que se repite, etc.
                })

        # PROYECTOS
        if 'project' in included_types:
            q_project = Project.query.filter_by(user_id=user_id, deleted=False)
            # Filtrar por rango: project con end_date >= start_date
            # y start_date <= end_date
            q_project = q_project.filter(Project.end_date >= start_date, Project.start_date <= end_date)
            if zone_id:
                q_project = q_project.filter_by(zone_id=zone_id)

            projects = q_project.all()
            for p in projects:
                items.append({
                    "type": "project",
                    "id": p.id,
                    "name": p.name,
                    "status": p.status,
                    "start_date": str(p.start_date) if p.start_date else None,
                    "end_date": str(p.end_date) if p.end_date else None,
                    "zone_id": p.zone_id
                })

        # 3) Construir respuesta final
        return {
            "period": period,
            "start_date": str(start_date),
            "end_date": str(end_date),
            "items": items
        }

    def export_agenda_to_ics(self, agenda_data):
        """
        Dado un dict 'agenda_data', produce un string ICS (iCalendar)
        básico para importar/sincronizar con Google Calendar u otros.
        Ejemplo muy simplificado.
        """
        # Cabecera ICS
        ics_lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//IterPolaris Agenda//EN"
        ]

        for item in agenda_data.get("items", []):
            uid = f"{item['type']}-{item['id']}@iterpolaris"
            summary = f"{item['type'].capitalize()}: {item['name']}"
            start = item.get("start_date") or agenda_data["start_date"]
            end = item.get("end_date") or agenda_data["end_date"]
            # ICS requiere formato "YYYYMMDDT000000Z" en UTC, 
            # pero haremos un ejemplo sencillo sin TZ
            start_ics = start.replace('-', '')  # "20230710"
            end_ics = end.replace('-', '')      # "20230715"
            ics_lines.append("BEGIN:VEVENT")
            ics_lines.append(f"UID:{uid}")
            ics_lines.append(f"SUMMARY:{summary}")
            ics_lines.append(f"DTSTART;VALUE=DATE:{start_ics}")
            ics_lines.append(f"DTEND;VALUE=DATE:{end_ics}")
            ics_lines.append("END:VEVENT")

        # Cierre ICS
        ics_lines.append("END:VCALENDAR")

        return "\r\n".join(ics_lines)
