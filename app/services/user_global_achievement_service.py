from app import db
from app.models.user_global_achievement import UserGlobalAchievement

class UserGlobalAchievementService:

    def get_user_achievements(self, user_id):
        """
        Retorna la lista de logros (UserGlobalAchievement) 
        que el usuario ha desbloqueado.
        """
        return UserGlobalAchievement.query.filter_by(user_id=user_id, deleted=False).all()

    def get_user_achievement(self, user_id, global_ach_id):
        """
        Retorna el record UserGlobalAchievement o None 
        si no lo tiene.
        """
        return UserGlobalAchievement.query.filter_by(
            user_id=user_id,
            global_achievement_id=global_ach_id,
            deleted=False
        ).first()

    def user_has_achievement(self, user_id, global_ach_id):
        """
        Simple check booleano.
        """
        record = self.get_user_achievement(user_id, global_ach_id)
        return record is not None