from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.role import Role
import json

from app.models.user_effects import UserEffects


user_skills = db.Table(
    "user_skills",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("skill_id", db.Integer, db.ForeignKey("skill.id"), primary_key=True)
)

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.Enum(Role), default=Role.USER, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    energy = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)
    xp = db.Column(db.Integer, default=0)

    skill_points = db.Column(db.Integer, default=0)

    level = db.Column(db.Integer, default=1)
    mana = db.Column(db.Integer, default=0)
    last_mana_reset_date = db.Column(db.Date, nullable=True)

    login_streak = db.Column(db.Integer, default=0)
    last_login_date = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)

    theme_color = db.Column(db.String(50))
    avatar_image = db.Column(db.String(255))
    background_image = db.Column(db.String(255))

    coins = db.Column(db.Integer, default=0)         # Monedas
    blue_gems = db.Column(db.Integer, default=0)     # Gemas azules

    # Campos para reset de contraseña
    reset_token = db.Column(db.String(255), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)

    # Relaciones
    # 1:1 con PersonalData (tabla separada)
    personal_data = db.relationship("PersonalData", backref="user", uselist=False, cascade="all, delete-orphan")
    # Un usuario puede tener muchos habits, tasks, journals, inventory items, notifications, projects y materials.
    habits = db.relationship("Habit", backref="user", lazy=True, cascade="all, delete-orphan")
    tasks = db.relationship("Task", backref="user", lazy=True, cascade="all, delete-orphan")
    journals = db.relationship("Journal", backref="user", lazy=True, cascade="all, delete-orphan")
    inventory_items = db.relationship("InventoryItem", backref="user", lazy=True, cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="user", lazy=True, cascade="all, delete-orphan")
    projects = db.relationship("Project", backref="user", lazy=True, cascade="all, delete-orphan")
    materials = db.relationship("Material", backref="user", lazy=True, cascade="all, delete-orphan")

    user_effects = db.relationship("UserEffects", back_populates="user", uselist=False, cascade="all, delete-orphan")

    skills = db.relationship("Skill",
                                secondary=user_skills,
                                backref="users")  

    def __repr__(self):
        return f"<User {self.id} {self.username}>"

    @property
    def password(self):
        raise AttributeError("Password no se puede leer directamente.")

    @password.setter
    def password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)
