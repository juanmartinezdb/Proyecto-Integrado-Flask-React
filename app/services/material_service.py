from app import db
from app.models.material import Material, project_materials
from app.models.project import Project

class MaterialService:
    def get_materials_with_filters(self, user_id, mat_type=None, query=None, project_id=None):
        """
        Aplica filtros:
          - mat_type: filtra por campo 'type'
          - query: busca en name o description
          - project_id: materiales asociados a un proyecto
        """
        q = Material.query.filter_by(user_id=user_id, deleted=False)

        if mat_type:
            q = q.filter_by(type=mat_type)

        if query:
            like_str = f"%{query}%"
            q = q.filter(
                (Material.name.ilike(like_str)) |
                (Material.description.ilike(like_str))
            )

        if project_id:
            # Filtrar los que estén asociados a un proyecto en la tabla 'project_materials'
            # O unir con la tabla project_materials:
            q = q.join(project_materials, aliased=True).filter_by(id_project=project_id)

        return q.all()

    def get_material_by_id(self, material_id, user_id):
        mat = Material.query.filter_by(id=material_id, deleted=False).first()
        if not mat:
            raise Exception("Material no encontrado.")
        if mat.user_id != int(user_id):
            raise Exception("No tienes acceso a este material.")
        return mat

    def create_material(self, data, user_id):
        mat = Material(
            name=data.get('name'),
            type=data.get('type'),
            url=data.get('url'),
            description=data.get('description'),
            user_id=user_id,
            deleted=False
        )
        db.session.add(mat)
        db.session.commit()
        return mat

    def update_material(self, material_id, data, user_id):
        mat = self.get_material_by_id(material_id, user_id)
        mat.name = data.get('name', mat.name)
        mat.type = data.get('type', mat.type)
        mat.url = data.get('url', mat.url)
        mat.description = data.get('description', mat.description)
        db.session.commit()
        return mat

    def delete_material(self, material_id, user_id):
        mat = self.get_material_by_id(material_id, user_id)
        mat.deleted = True
        db.session.commit()
