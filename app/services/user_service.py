import secrets
from datetime import datetime, timedelta

from app import db
from app.models.user import User
from app.models.personal_data import PersonalData
from app.models.role import Role

class UserService:

    def get_all_users(self):
        return User.query.filter_by(deleted=False).all()

    def get_user_by_id(self, user_id):
        user = User.query.filter_by(id=user_id, deleted=False).first()
        if not user:
            raise Exception("User no encontrado.")
        return user

    def get_user_by_username(self, username):
        user = User.query.filter_by(username=username, deleted=False).first()
        if not user:
            raise Exception("User no encontrado.")
        return user

    def create_user(self, data):
        """
        Crea un usuario en la base de datos.
        data = {
          'username': '',
          'email': '',
          'password': '',
          'role': 'USER' / 'ADMIN',
          'personal_data': {...}
        }
        """
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            raise Exception("Faltan datos para crear usuario (username, email, password)")

        existing_user = User.query.filter(
            (User.username == username) | (User.email == email),
            User.deleted == False
        ).first()
        if existing_user:
            raise Exception("Ya existe un usuario con ese username o email")

        user = User(
            username=username,
            email=email,
            deleted=False
        )
        user.password = password  # setter que hashea
        # role es un string "USER" o "ADMIN", se transforma a enum
        role_str = data.get('role', 'USER')
        try:
            user.role = Role(role_str)
        except ValueError:
            user.role = Role.USER

        db.session.add(user)
        db.session.flush()  # para obtener user.id

        # Si viene personal_data
        pd_data = data.get('personal_data')
        if pd_data:
            pd = PersonalData(
                first_name=pd_data.get('first_name'),
                last_name=pd_data.get('last_name'),
                gender=pd_data.get('gender'),
                age=pd_data.get('age'),
                birth_date=pd_data.get('birth_date'),
                city=pd_data.get('city'),
                country=pd_data.get('country'),
                phone=pd_data.get('phone'),
                occupation=pd_data.get('occupation'),
                user_id=user.id,
                deleted=False
            )
            db.session.add(pd)

        db.session.commit()
        return user

    def update_user(self, user_id, data):
        """
        Actualiza los datos del usuario (por sí mismo o por admin).
        """
        user = self.get_user_by_id(user_id)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.password = data['password']
        if 'role' in data:
            try:
                user.role = Role(data['role'])
            except ValueError:
                pass

        # Actualizar personal_data
        pd_data = data.get('personal_data')
        if pd_data:
            if not user.personal_data:
                user.personal_data = PersonalData(user_id=user_id, deleted=False)
            user.personal_data.first_name = pd_data.get('first_name', user.personal_data.first_name)
            user.personal_data.last_name = pd_data.get('last_name', user.personal_data.last_name)
            user.personal_data.gender = pd_data.get('gender', user.personal_data.gender)
            user.personal_data.age = pd_data.get('age', user.personal_data.age)
            user.personal_data.birth_date = pd_data.get('birth_date', user.personal_data.birth_date)
            user.personal_data.city = pd_data.get('city', user.personal_data.city)
            user.personal_data.country = pd_data.get('country', user.personal_data.country)
            user.personal_data.phone = pd_data.get('phone', user.personal_data.phone)
            user.personal_data.occupation = pd_data.get('occupation', user.personal_data.occupation)

        db.session.commit()
        return user

    def delete_user(self, user_id):
        """
        Borrado lógico del usuario (solo admin).
        """
        user = self.get_user_by_id(user_id)
        user.deleted = True
        db.session.commit()
        # También se marca personal_data como borrado si deseas
        if user.personal_data:
            user.personal_data.deleted = True
            db.session.commit()
        return user

    def change_password(self, user_id, current_password, new_password):
        """
        Cambia la contraseña si la actual coincide.
        """
        user = self.get_user_by_id(user_id)
        if not user.check_password(current_password):
            raise Exception("La contraseña actual es incorrecta")
        user.password = new_password  # setter que hashea
        db.session.commit()

    # ---- Nuevos métodos para recuperación de contraseña ----

    def forgot_password(self, user_identifier):
        """
        Genera un token de reseteo de contraseña para el usuario.
        user_identifier puede ser username o email.
        """
        user = User.query.filter(
            ((User.username == user_identifier) | (User.email == user_identifier)),
            User.deleted == False
        ).first()
        if not user:
            raise Exception("No se encontró usuario con esos datos")

        # Generar un token seguro y setear expiración (ej. 15 minutos)
        reset_token = secrets.token_urlsafe(48)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(minutes=15)

        db.session.commit()
        return reset_token

    def reset_password(self, reset_token, new_password):
        """
        Verifica el token y, si es válido, actualiza la contraseña.
        """
        user = User.query.filter_by(reset_token=reset_token, deleted=False).first()
        if not user:
            raise Exception("Token inválido")

        if user.reset_token_expires and datetime.utcnow() > user.reset_token_expires:
            raise Exception("Token expirado. Solicite uno nuevo")

        # Asigna la nueva contraseña y limpia el token
        user.password = new_password
        user.reset_token = None
        user.reset_token_expires = None

        db.session.commit()
        return user
