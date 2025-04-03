# from app import db
# from app.models.achievement import Achievement
# # Ejemplo: si computas tasks completadas, import Task
# from app.models.task import Task

# class AchievementService:

#     def get_user_achievements(self, user_id):
#         return Achievement.query.filter_by(user_id=user_id, deleted=False).all()

#     def get_user_achievements_filtered(self, user_id, ach_type):
#         q = Achievement.query.filter_by(user_id=user_id, deleted=False)
#         if ach_type:
#             q = q.filter_by(type=ach_type)
#         return q.all()

#     def get_by_id(self, achievement_id, user_id):
#         ach = Achievement.query.filter_by(id=achievement_id, deleted=False).first()
#         if not ach:
#             raise Exception("Achievement no encontrado")
#         if ach.user_id != user_id:
#             raise Exception("No tienes acceso a este achievement")
#         return ach

#     def create_achievement(self, data, user_id):
#         ach = Achievement(
#             name=data.get('name'),
#             description=data.get('description'),
#             type=data.get('type'),
#             threshold=data.get('threshold', 0),
#             unlocked=False,
#             user_id=user_id,
#             deleted=False
#         )
#         db.session.add(ach)
#         db.session.commit()
#         return ach

#     def update_achievement(self, achievement_id, data, user_id):
#         ach = self.get_by_id(achievement_id, user_id)
#         ach.name = data.get('name', ach.name)
#         ach.description = data.get('description', ach.description)
#         ach.type = data.get('type', ach.type)
#         ach.threshold = data.get('threshold', ach.threshold)
#         ach.unlocked = data.get('unlocked', ach.unlocked)
#         db.session.commit()
#         return ach

#     def delete_achievement(self, achievement_id, user_id):
#         ach = self.get_by_id(achievement_id, user_id)
#         ach.deleted = True
#         db.session.commit()

#     def check_and_unlock_achievement(self, user_id, achievement_type, value):
#         """
#         Lógica para 'desbloquear' achievements según tipo.
#         Ej: if achievement_type='tasks_completed' and value >= threshold => unlocked = True
#         """
#         achievements = Achievement.query.filter_by(
#             user_id=user_id, type=achievement_type, unlocked=False, deleted=False
#         ).all()
#         for ach in achievements:
#             if value >= ach.threshold:
#                 ach.unlocked = True
#         db.session.commit()

#     def get_achievement_progress(self, achievement_id, user_id):
#         """
#         Retorna un objeto con la info de cuántos 'puntos' o 'progreso' 
#         lleva el usuario respecto al threshold. 
#         p.e. si es 'tasks_completed', calculamos cuántas tasks completadas
#         y comparamos con achievement.threshold.
#         """
#         ach = self.get_by_id(achievement_id, user_id)
#         progress_data = {
#             "achievement_id": ach.id,
#             "name": ach.name,
#             "type": ach.type,
#             "threshold": ach.threshold,
#             "unlocked": ach.unlocked
#         }

#         current_value = 0
#         if ach.type == "tasks_completed":
#             # Calculamos cuántas tasks completó el user
#             completed_count = Task.query.filter_by(
#                 user_id=user_id, deleted=False, status="COMPLETED"
#             ).count()
#             current_value = completed_count
#         elif ach.type == "xp":
#             # Ejemplo, si en el modelo user tenemos user.xp
#             # Este approach implicaría query a la tabla user 
#             # or lo que necesites
#             pass
#         elif ach.type == "streak":
#             # Ejemplo: si la racha la sacas de habits o journals
#             pass
#         # etc.

#         progress_data["current_value"] = current_value
#         progress_data["progress_pct"] = 0
#         if ach.threshold > 0:
#             progress_data["progress_pct"] = round((current_value / ach.threshold)*100, 2)

#         return progress_data
