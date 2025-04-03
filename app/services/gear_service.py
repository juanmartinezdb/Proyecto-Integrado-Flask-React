from app import db
from app.models.gear import Gear
from app.models.effect import Effect

class GearService:

    def get_gears_with_filters(self, gear_type=None, consumable=None,
                               min_cost=None, max_cost=None, rarity=None):
        query = Gear.query.filter_by(deleted=False)

        if gear_type:
            query = query.filter_by(type=gear_type)

        if consumable is not None:
            # 'consumable' vendrá como string 'true'/'false'
            is_consumable = consumable.lower() == 'true'
            query = query.filter_by(consumable=is_consumable)

        if min_cost:
            query = query.filter(Gear.cost >= int(min_cost))
        if max_cost:
            query = query.filter(Gear.cost <= int(max_cost))

        if rarity:
            query = query.filter_by(rarity=rarity)

        return query.all()

    def get_gear_by_id(self, gear_id):
        gear = Gear.query.filter_by(id=gear_id, deleted=False).first()
        if not gear:
            raise Exception("Gear no encontrado")
        return gear

    def create_gear(self, data):
        effect_id = data.get('effect_id')
        if effect_id is not None:
            eff = Effect.query.filter_by(id=effect_id, deleted=False).first()
            if not eff:
                raise Exception("Effect no encontrado")

        gear = Gear(
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            type=data.get('type'),
            max_uses=data.get('max_uses'),
            cost=data.get('cost'),
            consumable=data.get('consumable', True),
            rarity=data.get('rarity'),
            effect_id=effect_id if effect_id else None,
            deleted=False
        )
        db.session.add(gear)
        db.session.commit()
        return gear

    def update_gear(self, gear_id, data):
        gear = self.get_gear_by_id(gear_id)

        new_effect_id = data.get('effect_id')
        if new_effect_id is not None:
            eff = Effect.query.filter_by(id=new_effect_id, deleted=False).first()
            if not eff:
                raise Exception("Effect no encontrado")
            gear.effect_id = eff.id

        gear.name = data.get('name', gear.name)
        gear.description = data.get('description', gear.description)
        gear.image = data.get('image', gear.image)
        gear.type = data.get('type', gear.type)
        gear.max_uses = data.get('max_uses', gear.max_uses)
        gear.cost = data.get('cost', gear.cost)
        gear.consumable = data.get('consumable', gear.consumable)
        gear.rarity = data.get('rarity', gear.rarity)

        db.session.commit()
        return gear

    def delete_gear(self, gear_id):
        gear = self.get_gear_by_id(gear_id)
        gear.deleted = True
        db.session.commit()
