from app import db
from app.models.zone import Zone
from app.models.project import Project
from app.models.task import Task
from app.models.habit import Habit

class ZoneService:

    def get_zones_with_filters(self, user_id, name=None,
                               min_energy=None, max_energy=None,
                               min_level=None, max_level=None,
                               min_xp=None, max_xp=None):
        q = Zone.query.filter_by(user_id=user_id, deleted=False)

        if name:
            # Filtrado "like"
            q = q.filter(Zone.name.ilike(f"%{name}%"))

        if min_energy is not None:
            q = q.filter(Zone.energy >= int(min_energy))
        if max_energy is not None:
            q = q.filter(Zone.energy <= int(max_energy))

        if min_level is not None:
            q = q.filter(Zone.level >= int(min_level))
        if max_level is not None:
            q = q.filter(Zone.level <= int(max_level))

        if min_xp is not None:
            q = q.filter(Zone.xp >= int(min_xp))
        if max_xp is not None:
            q = q.filter(Zone.xp <= int(max_xp))

        return q.all()

    def get_zone_by_id(self, zone_id, user_id):
        z = Zone.query.filter_by(id=zone_id, deleted=False).first()
        if not z:
            raise Exception("Zone no encontrada.")
        if z.user_id != int(user_id):
            raise Exception("No tienes acceso a esta Zone.")
        return z

    def create_zone(self, data, user_id):
        z = Zone(
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            color=data.get('color'),
            energy=data.get('energy', 0),
            xp=data.get('xp', 0),
            level=data.get('level', 1),
            user_id=user_id,
            deleted=False
        )
        db.session.add(z)
        db.session.commit()
        return z

    def update_zone(self, zone_id, data, user_id):
        z = self.get_zone_by_id(zone_id, user_id)
        z.name = data.get('name', z.name)
        z.description = data.get('description', z.description)
        z.image = data.get('image', z.image)
        z.color = data.get('color', z.color)
        z.energy = data.get('energy', z.energy)
        z.xp = data.get('xp', z.xp)
        z.level = data.get('level', z.level)
        db.session.commit()
        return z

    def delete_zone(self, zone_id, user_id):
        z = self.get_zone_by_id(zone_id, user_id)
        z.deleted = True
        db.session.commit()

    def get_zone_stats(self, zone_id, user_id):
        """
        Retorna un dict con estadísticas (energy, xp, level, etc.)
        """
        z = self.get_zone_by_id(zone_id, user_id)
        stats = {
            "zone_id": z.id,
            "name": z.name,
            "energy": z.energy,
            "xp": z.xp,
            "level": z.level
        }
        return stats

    def assign_zone(self, zone_id, user_id, obj_type, item_id):
        """
        Asigna la zona a un objeto (proyecto, tarea o hábito).
        """
        z = self.get_zone_by_id(zone_id, user_id)

        if obj_type == 'project':
            project = Project.query.filter_by(id=item_id, deleted=False).first()
            if not project:
                raise Exception("Proyecto no encontrado")
            if project.user_id != user_id:
                raise Exception("No tienes acceso a este proyecto")
            project.zone_id = z.id
            db.session.commit()

        elif obj_type == 'task':
            task = Task.query.filter_by(id=item_id, deleted=False).first()
            if not task:
                raise Exception("Tarea no encontrada")
            if task.user_id != user_id:
                raise Exception("No tienes acceso a esta tarea")
            # task no tiene zone_id directo si no se definió, 
            # a menos que lo manejes indirectamente por project. 
            # Podrías definir un task.zone_id si deseas.
            # Sino, puedes reasignar la task a un "dummy" project de la zona, etc.
            raise Exception("No se implementó zone_id directo en Task, maneja la lógica extra si procede.")

        elif obj_type == 'habit':
            habit = Habit.query.filter_by(id=item_id, deleted=False).first()
            if not habit:
                raise Exception("Hábito no encontrado")
            if habit.user_id != user_id:
                raise Exception("No tienes acceso a este hábito")
            habit.zone_id = z.id
            db.session.commit()

        else:
            raise Exception("Tipo de objeto no válido para asignar zona (project|task|habit)")
        
    def add_xp_to_zone(self, zone_id, xp_gained):
        """
        Suma xp a la zona, comprueba si sube de nivel => +1 gema amarilla
        """
        z = Zone.query.filter_by(id=zone_id, deleted=False).first()
        if not z:
            raise Exception("Zona no encontrada")

        z.xp += xp_gained

        level_up = False
        while z.xp >= xp_needed_for_zone_level(z.level + 1):
            z.level += 1
            level_up = True
            z.yellow_gems += 1  # +1 gema amarilla al subir de nivel

        db.session.commit()
        return {
            "zone_id": z.id,
            "zone_level": z.level,
            "zone_xp": z.xp,
            "yellow_gems": z.yellow_gems,
            "level_up": level_up
        }

def xp_needed_for_zone_level(level):
    """
    Lógica para la progresión de nivel de zona.
    """
    return 50 * level