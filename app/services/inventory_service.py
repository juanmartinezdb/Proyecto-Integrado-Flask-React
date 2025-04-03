from app import db
from app.models.inventory_item import InventoryItem
from app.models.gear import Gear
from datetime import datetime

class InventoryService:
    def get_user_inventory(self, user_id):
        return InventoryItem.query.filter_by(user_id=user_id, deleted=False).all()

    def get_user_inventory_filtered(self, user_id, gear_type, min_uses, max_uses, acquired_from, acquired_to):
        """
        Aplica filtros avanzados para el inventario.
        """
        q = InventoryItem.query.filter_by(user_id=user_id, deleted=False)

        # Si filtras por gear_type => unirse con Gear y filtrar:
        if gear_type:
            q = q.join(Gear).filter(Gear.type == gear_type)

        if min_uses:
            q = q.filter(InventoryItem.remaining_uses >= int(min_uses))
        if max_uses:
            q = q.filter(InventoryItem.remaining_uses <= int(max_uses))

        if acquired_from:
            try:
                d_from = datetime.strptime(acquired_from, "%Y-%m-%d")
                q = q.filter(InventoryItem.acquired_at >= d_from)
            except:
                pass

        if acquired_to:
            try:
                d_to = datetime.strptime(acquired_to, "%Y-%m-%d")
                q = q.filter(InventoryItem.acquired_at <= d_to)
            except:
                pass

        return q.all()

    def get_item_by_id(self, item_id, user_id):
        item = InventoryItem.query.filter_by(id=item_id, deleted=False).first()
        if not item:
            raise Exception("Item no encontrado.")
        if item.user_id != int(user_id):
            raise Exception("No tienes acceso a este ítem.")
        return item

    def add_gear_to_user(self, data, user_id):
        gear_id = data.get('gear_id')
        gear = Gear.query.filter_by(id=gear_id, deleted=False).first()
        if not gear:
            raise Exception("Gear no encontrado.")

        remaining_uses = data.get('remaining_uses', gear.max_uses)

        item = InventoryItem(
            remaining_uses=remaining_uses,
            gear_id=gear_id,
            user_id=user_id,
            deleted=False
        )
        db.session.add(item)
        db.session.commit()
        return item

    def update_inventory_item(self, item_id, data, user_id):
        item = self.get_item_by_id(item_id, user_id)
        if 'remaining_uses' in data:
            item.remaining_uses = data['remaining_uses']
        db.session.commit()
        return item

    def delete_inventory_item(self, item_id, user_id):
        item = self.get_item_by_id(item_id, user_id)
        item.deleted = True
        db.session.commit()

    def use_item(self, item_id, user_id):
        """
        'Consume' un uso del item, si es consumible y si 'remaining_uses' > 0.
        """
        item = InventoryItem.query.filter_by(id=item_id, deleted=False).first()
        if not item:
            raise Exception("Item no encontrado.")
        if item.user_id != user_id:
            raise Exception("No tienes acceso a este ítem.")

        if item.remaining_uses is None:
            # Si no definiste max_uses, podría significar que no se consume
            return {"message": "Este ítem no es consumible o uso ilimitado."}

        if item.remaining_uses <= 0:
            raise Exception("Ya no te quedan usos de este ítem.")

        item.remaining_uses -= 1
        db.session.commit()

        return {
            "message": f"Has usado el ítem con id={item_id}. Quedan {item.remaining_uses} usos.",
            "remaining_uses": item.remaining_uses
        }