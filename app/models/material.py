from app import db

# Asociación Many-to-Many entre Project y Material:
project_materials = db.Table(
    "project_materials",
    db.Column("id_project", db.Integer, db.ForeignKey("project.id"), primary_key=True),
    db.Column("id_material", db.Integer, db.ForeignKey("material.id"), primary_key=True)
)

class Material(db.Model):
    __tablename__ = "material"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100))
    type = db.Column(db.String(50))  # "documento", "link", "video", etc.
    url = db.Column(db.String(255))
    description = db.Column(db.String(255))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    zone_id = db.Column(db.Integer, db.ForeignKey('zone.id'), nullable=True)

    projects = db.relationship(
        "Project",
        secondary=project_materials,
        back_populates="materials"
    )

    def __repr__(self):
        return f"<Material {self.id} {self.name}>"
