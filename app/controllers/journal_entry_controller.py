from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.journal_entry_service import JournalEntryService
from app.schemas.journal_entry_schema import JournalEntrySchema

journal_entry_bp = Blueprint('journal_entry_bp', __name__)
entry_service = JournalEntryService()

entry_schema = JournalEntrySchema()
entries_schema = JournalEntrySchema(many=True)

@journal_entry_bp.route('/<int:journal_id>/entries', methods=['GET'])
@jwt_required()
def get_entries_by_journal(journal_id):
    user_id = get_jwt_identity()
    try:
        entries = entry_service.get_entries_by_journal(journal_id, user_id)
        return jsonify(entries_schema.dump(entries)), 200
    except Exception as e:
        return {"error": str(e)}, 404

@journal_entry_bp.route('/<int:journal_id>/entries', methods=['POST'])
@jwt_required()
def create_entry(journal_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        new_entry = entry_service.create_entry(journal_id, data, user_id)
        return entry_schema.dump(new_entry), 201
    except Exception as e:
        return {"error": str(e)}, 400

@journal_entry_bp.route('/<int:journal_id>/entries/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_entry_by_id(journal_id, entry_id):
    user_id = get_jwt_identity()
    try:
        entry = entry_service.get_entry_by_id(entry_id, user_id)
        return entry_schema.dump(entry), 200
    except Exception as e:
        return {"error": str(e)}, 404

@journal_entry_bp.route('/<int:journal_id>/entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(journal_id, entry_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        updated = entry_service.update_entry(entry_id, data, user_id)
        return entry_schema.dump(updated), 200
    except Exception as e:
        return {"error": str(e)}, 404

@journal_entry_bp.route('/<int:journal_id>/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(journal_id, entry_id):
    user_id = get_jwt_identity()
    try:
        entry_service.delete_entry(entry_id, user_id)
        return {}, 204
    except Exception as e:
        return {"error": str(e)}, 404
