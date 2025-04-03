import pymysql
from sqlalchemy.engine.url import make_url

def create_database_if_not_exists(app):
    """
    Comprueba si la base de datos existe y la crea si no existe.
    """
    db_uri = app.config["SQLALCHEMY_DATABASE_URI"]
    url = make_url(db_uri)

    # Conexión al servidor MySQL sin seleccionar base de datos
    connection = pymysql.connect(
        host=url.host,
        user=url.username,
        password=url.password,
        port=url.port or 3306,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    db_name = url.database

    try:
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        connection.commit()
        print(f"Base de datos '{db_name}' comprobada o creada.")
    except Exception as e:
        print(f"Error al comprobar o crear la base de datos: {e}")
    finally:
        connection.close()
