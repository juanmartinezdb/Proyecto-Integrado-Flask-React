from app import db

class Zone(db.Model):
    __tablename__ = "zone"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    color = db.Column(db.String(50))

    energy = db.Column(db.Integer, default=0)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    
    yellow_gems = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<Zone {self.id} {self.name}>"
