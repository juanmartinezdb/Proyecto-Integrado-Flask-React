# app/auth/security.py
from app.models.user import User
from werkzeug.security import check_password_hash  # si guardas en hash
from flask_jwt_extended import create_access_token

def authenticate(username, password):
    user = User.query.filter_by(username=username, deleted=False).first()
    if user and check_password_hash(user.password, password):
        # O si la password no está en hash, haz la comparación adecuada
        access_token = create_access_token(identity=user.id)
        return access_token
    return None
