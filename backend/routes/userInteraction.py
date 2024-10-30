from flask import Blueprint, request, jsonify
from models import db, UserInteraction, InteractionType
from datetime import datetime
import pytz

user_interaction_bp = Blueprint('user_interaction', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@user_interaction_bp.route('/api/user_interactions', methods=['POST'])
def create_interaction():
    data = request.json
    new_interaction = UserInteraction(
        id_user=data['id_user'],
        shoe_detail_id=data['shoe_detail_id'],
        interaction_type=InteractionType[data['interaction_type']],
        interaction_date=get_current_time_wita()
    )
    db.session.add(new_interaction)
    db.session.commit()
    return jsonify({'message': 'Interaction recorded successfully'}), 201

@user_interaction_bp.route('/api/user_interactions/<int:interaction_id>', methods=['GET'])
def get_interaction(interaction_id):
    interaction = UserInteraction.query.get(interaction_id)
    if not interaction:
        return jsonify({'message': 'Interaction not found'}), 404
    return jsonify({
        'interaction_id': interaction.interaction_id,
        'id_user': interaction.id_user,
        'shoe_detail_id': interaction.shoe_detail_id,
        'interaction_type': interaction.interaction_type.value,
        'interaction_date': interaction.interaction_date
    }), 200

@user_interaction_bp.route('/api/user_interactions/<int:interaction_id>', methods=['PUT'])
def update_interaction(interaction_id):
    data = request.json
    interaction = UserInteraction.query.get(interaction_id)
    if not interaction:
        return jsonify({'message': 'Interaction not found'}), 404
    interaction.interaction_type = InteractionType[data['interaction_type']]
    interaction.interaction_date = get_current_time_wita()
    db.session.commit()
    return jsonify({'message': 'Interaction updated successfully'}), 200

@user_interaction_bp.route('/api/user_interactions/<int:interaction_id>', methods=['DELETE'])
def delete_interaction(interaction_id):
    interaction = UserInteraction.query.get(interaction_id)
    if not interaction:
        return jsonify({'message': 'Interaction not found'}), 404
    db.session.delete(interaction)
    db.session.commit()
    return jsonify({'message': 'Interaction deleted successfully'}), 200 