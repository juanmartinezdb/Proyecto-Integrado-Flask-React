# app/services/store_service.py

from app import db
from app.models.user import User
from app.models.zone import Zone
from app.models.skill import Skill
from app.models.gear import Gear
from app.models.inventory_item import InventoryItem
from app.services.skill_service import SkillService

class StoreService:

    def buy_skill(self, user_id, skill_id, zone_id=None):
        """
        Lógica de compra de skill con gemas:
         - Si is_zone_skill=True => se requiere zone_id y se consumen gemas amarillas de la zona
         - Si is_zone_skill=False => se consumen gemas azules del user
         - Se chequea level_required
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")

        skill = Skill.query.filter_by(id=skill_id, deleted=False).first()
        if not skill:
            raise Exception("Skill no encontrada")

        # Revisar nivel requerido
        if user.level < skill.level_required:
            raise Exception(f"Requieres nivel {skill.level_required} para esta skill.")

        if skill.is_zone_skill:
            # Se compra con gemas amarillas => hace falta zone_id
            if not zone_id:
                raise Exception("Se requiere zone_id para comprar skill de zona.")
            zone = Zone.query.filter_by(id=zone_id, deleted=False).first()
            if not zone or zone.user_id != user.id:
                raise Exception("Zona no encontrada o no perteneces a ella.")

            # Coste en gemas amarillas => tú definiste 3 gemas amarillas
            gem_cost = 3
            if zone.yellow_gems < gem_cost:
                raise Exception("No tienes suficientes gemas amarillas en la zona.")
            zone.yellow_gems -= gem_cost

        else:
            # Skill personal => 1 gema azul del user
            gem_cost = 1
            if user.blue_gems < gem_cost:
                raise Exception("No tienes gemas azules suficientes.")
            user.blue_gems -= gem_cost

        user.skills.append(skill)
        db.session.commit()

        return {"message": f"Skill '{skill.name}' comprada con éxito."}

    def buy_item(self, user_id, gear_id):
        """
        Compra un Gear con monedas. 
        Revisa:
         - user.coins >= gear.cost
         - user.level >= gear.level_required
         - crea un InventoryItem para el user
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado")

        gear = Gear.query.filter_by(id=gear_id, deleted=False).first()
        if not gear:
            raise Exception("Ítem no encontrado")

        final_cost = gear.cost
        if getattr(user, "store_discount_active", False):
            discount_value = getattr(user, "store_discount_value", 0.2)
            final_cost = int(final_cost * (1 - discount_value))
            # Desactivamos el descuento tras esta compra
            user.store_discount_active = False
            user.store_discount_value = 0.0

        if user.coins < final_cost:
            raise Exception("No tienes suficientes monedas.")

        user.coins -= final_cost
        db.session.commit()

        # Crear el InventoryItem
        item = InventoryItem(
            gear_id=gear.id,
            user_id=user.id,
            remaining_uses=gear.max_uses,
            deleted=False
        )
        db.session.add(item)
        db.session.commit()

        return {"message": f"Has comprado '{gear.name}' por {final_cost} monedas."}
    
    def list_skills_in_store(self, user_id, query_params):
            """
            Lista las skills que el usuario aún NO posee, aplicando filtros si se pasan.
            """
            skill_service = SkillService()

            # Obtener skills con filtros
            s_type = query_params.get('type')
            min_level = query_params.get('min_level')
            max_level = query_params.get('max_level')
            min_cost = query_params.get('min_cost')
            max_cost = query_params.get('max_cost')

            all_skills = skill_service.get_skills_filtered(s_type, min_level, max_level, min_cost, max_cost)

            # Obtener skills que YA tiene el usuario
            user = User.query.filter_by(id=user_id, deleted=False).first()
            owned_skills = [s.id for s in user.skills]

            # Filtrar las que aún no tiene
            available_skills = [s for s in all_skills if s.id not in owned_skills]

            # Transformar a JSON-like para respuesta
            result = [{
                "id": s.id,
                "name": s.name,
                "description": s.description,
                "level_required": s.level_required,
                "cost": s.cost,
                "mana": s.mana,
                "is_zone_skill": s.is_zone_skill
            } for s in available_skills]

            return result
    
    def list_gear_in_store(self, user_id, query_params):
        """
        Lista los gear que el usuario aún NO posee, aplicando filtros si se pasan.
        """
        # Obtener todos los gear que no están eliminados
        q = Gear.query.filter_by(deleted=False)

        rarity = query_params.get('rarity')
        if rarity:
            q = q.filter_by(rarity=rarity)

        all_gear = q.all()

        # Obtener ítems que el usuario ya tiene
        owned_items = InventoryItem.query.filter_by(user_id=user_id, deleted=False).all()
        owned_gear_ids = [i.gear_id for i in owned_items]

        # Filtrar los que aún no tiene
        available_gear = [g for g in all_gear if g.id not in owned_gear_ids]

        result = [{
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "cost": g.cost,
            "max_uses": g.max_uses
        } for g in available_gear]

        return result