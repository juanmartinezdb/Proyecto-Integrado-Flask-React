from app import db

# Relacionado con "Effect" global
class Effect(db.Model):
    __tablename__ = "effect"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    name = db.Column(db.String(100), nullable=False)
    logic_key = db.Column(db.String(100), unique=True)
    description = db.Column(db.String(255))
    type = db.Column(db.String(50))  # "mental", "physical", etc.

    # target_entities (String[] en Java) se puede mapear como JSON o con table rel:
    # Una forma rápida: guardarlo en JSON (requiere config JSON col en tu BD).
    # O creamos una tabla intermedia. Para simplificar, lo dejamos en un string.
    # Si quieres hacerlo como many values, se puede usar un association table.
    # A continuación un ejemplo en string (coma-separated):
    target_entities = db.Column(db.String(255))

    def __repr__(self):
        return f"<Effect {self.id} {self.name}>"
