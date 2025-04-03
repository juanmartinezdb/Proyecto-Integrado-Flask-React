from app import db
from app.models.skill import Skill
from app.models.effect import Effect
from app.models.user import User

class SkillService:
    def get_all_skills(self):
        return Skill.query.filter_by(deleted=False).all()

    def get_skills_filtered(self, s_type=None, min_level=None, max_level=None, min_cost=None, max_cost=None):
        q = Skill.query.filter_by(deleted=False)
        if s_type:
            q = q.filter_by(type=s_type)
        if min_level:
            q = q.filter(Skill.level_required >= int(min_level))
        if max_level:
            q = q.filter(Skill.level_required <= int(max_level))
        if min_cost:
            q = q.filter(Skill.cost >= int(min_cost))
        if max_cost:
            q = q.filter(Skill.cost <= int(max_cost))
        return q.all()

    def get_skill_by_id(self, skill_id):
        sk = Skill.query.filter_by(id=skill_id, deleted=False).first()
        if not sk:
            raise Exception("Skill no encontrada.")
        return sk

    def create_skill(self, data):
        eff = None
        effect_id = data.get('effect_id')
        if effect_id is not None:
            eff = Effect.query.filter_by(id=effect_id, deleted=False).first()
            if not eff:
                raise Exception("Effect no encontrado para la skill.")

        sk = Skill(
            name=data.get('name'),
            description=data.get('description'),
            type=data.get('type'),
            level_required=data.get('level_required', 0),
            cost=data.get('cost', 0),
            mana=data.get('mana', 0),
            icon=data.get('icon'),
            effect_id=eff.id if eff else None,
            deleted=False
        )
        db.session.add(sk)
        db.session.commit()
        return sk

    def update_skill(self, skill_id, data):
        sk = self.get_skill_by_id(skill_id)

        if 'effect_id' in data:
            eff = Effect.query.filter_by(id=data['effect_id'], deleted=False).first()
            if not eff:
                raise Exception("Effect no encontrado.")
            sk.effect_id = eff.id

        sk.name = data.get('name', sk.name)
        sk.description = data.get('description', sk.description)
        sk.type = data.get('type', sk.type)
        sk.level_required = data.get('level_required', sk.level_required)
        sk.cost = data.get('cost', sk.cost)
        sk.mana = data.get('mana', sk.mana)
        sk.icon = data.get('icon', sk.icon)

        db.session.commit()
        return sk

    def delete_skill(self, skill_id):
        sk = self.get_skill_by_id(skill_id)
        sk.deleted = True
        db.session.commit()

    def use_skill(self, user_id, skill_id):
        """
        Aplica el costo de mana al usar la skill, 
        y luego ejecuta la lógica de 'effect' si corresponde.
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        skill = Skill.query.filter_by(id=skill_id, deleted=False).first()
        if not user or not skill:
            raise Exception("No se encontró la skill o el usuario.")

        # Verifica si el usuario tiene mana suficiente
        if user.mana < skill.mana:
            raise Exception("No tienes suficiente mana para usar esta skill.")

        # Consumir mana
        user.mana -= skill.mana

        # Aplicar effect si existe
        if skill.effect_id:
            effect = Effect.query.filter_by(id=skill.effect_id, deleted=False).first()
            if effect:
                from app.services.effect_service import EffectService
                EffectService.apply_effect(effect, user, context={})

        db.session.commit()

        return {
            "message": f"Has usado la skill {skill.name}, te queda {user.mana} de mana."
        }

    def reset_daily_mana(self, user_id):
        """
        Restaura el mana del usuario a (100 + 20*level).
        Llamar, por ejemplo, al cambiar de día.
        """
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("Usuario no encontrado.")
        user.mana = 100 + 20 * user.level
        db.session.commit()
        return user.mana