import os

class Config:
    # Secret key interna de Flask
    SECRET_KEY = os.environ.get("SECRET_KEY", "clave_secreta_super_segura")

    # Adaptando la conexión a MySQL, equivalente a:
    # spring.datasource.url=jdbc:mysql://localhost:3306/iterpolaris?createDatabaseIfNotExist=true
    # spring.datasource.username=root
    # spring.datasource.password=12345678
    #
    # En Flask/SQLAlchemy se usaría el driver "mysql+pymysql".
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:12345678@localhost:3306/iterpolarisflask"
    )


    # Equivalente a spring.jpa.show-sql=true (opcional)
    SQLALCHEMY_ECHO = False  # Ponlo True si deseas ver las sentencias SQL en consola

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    # spring.security.jwt.secret -> Este se traduce al JWT_SECRET_KEY en Flask
    # spring.security.jwt.expiration -> lo ajustamos en segundos
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "h6fBgJFXQw7RDtaICtALEPHoO1Ka1NezdvSfl1SUg/M=")
    JWT_ACCESS_TOKEN_EXPIRES = 900  # 15 minutos en segundos (equivalente a 900000 ms)

    # Si en un futuro quieres manejar refresco de tokens, podrás añadir:
    # JWT_REFRESH_TOKEN_EXPIRES = 86400  # por ejemplo, 24h

