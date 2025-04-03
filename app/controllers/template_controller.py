from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.template_service import TemplateService
from app.schemas.template_schema import TemplateSchema

template_bp = Blueprint('template_bp', __name__)
template_service = TemplateService()

template_schema = TemplateSchema()
templates_schema = TemplateSchema(many=True)

@template_bp.route('', methods=['GET'])
@jwt_required()
def get_all_templates():
    """
    GET /templates
    Soporta filtro por category=task|habit|project
    Ejemplo: /templates?category=habit
    """
    user_id = get_jwt_identity()
    category = request.args.get('category')
    items = template_service.get_all_templates(user_id, category)
    return jsonify(templates_schema.dump(items)), 200

@template_bp.route('', methods=['POST'])
@jwt_required()
def create_template():
    """
    POST /templates
    Crea una plantilla nueva. 
    Body:
    {
      "name": "...",
      "description": "...",
      "energy": 10,
      "points": 30,
      "priority": "HIGH",
      "cycle": "DAILY",
      "category": "habit"  // "task" | "project" | ...
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_template = template_service.create_template(data, user_id)
        return template_schema.dump(new_template), 201
    except Exception as e:
        return {"error": str(e)}, 400

@template_bp.route('/<int:template_id>', methods=['PUT'])
@jwt_required()
def update_template(template_id):
    """
    PUT /templates/{id}
    Permite editar la plantilla.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = template_service.update_template(template_id, data, user_id)
        return template_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@template_bp.route('/<int:template_id>', methods=['DELETE'])
@jwt_required()
def delete_template(template_id):
    """
    DELETE /templates/{id}
    Borrado lógico de una plantilla.
    """
    user_id = get_jwt_identity()
    try:
        template_service.delete_template(template_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404

@template_bp.route('/use/<int:template_id>', methods=['POST'])
@jwt_required()
def use_template(template_id):
    """
    POST /templates/use/{template_id}
    Función de "guardar como plantilla" inversa: 
    Aplica la plantilla para crear un nuevo elemento (task/habit/project).
    Body (opcional) puede incluir campos a sobrescribir.
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    try:
        # Devuelve el nuevo objeto creado
        result = template_service.use_template(template_id, user_id, data)
        return jsonify(result), 201
    except Exception as e:
        return {"error": str(e)}, 400
