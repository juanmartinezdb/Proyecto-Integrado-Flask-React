from app import db
from datetime import date

class PersonalData(db.Model):
    __tablename__ = "personal_data"

    id = db.Column(db.Integer, primary_key=True)
    deleted = db.Column(db.Boolean, default=False)

    first_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(20))         # "male", "female", "other", etc.
    age = db.Column(db.Integer)
    birth_date = db.Column(db.Date)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    phone = db.Column(db.String(50))
    occupation = db.Column(db.String(100))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    def __repr__(self):
        return f"<PersonalData {self.id} {self.first_name}>"
