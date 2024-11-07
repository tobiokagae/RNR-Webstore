from flask import Blueprint, request, jsonify
from models import db, UserInteraction, InteractionType
from datetime import datetime
import pytz
# from data_training import train_model

user_interaction_bp = Blueprint('user_interaction', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@user_interaction_bp.route('/user_interactions', methods=['GET'])
def get_all_interactions():
    interactions = UserInteraction.query.all()
    return jsonify([
        {
            'interaction_id': i.interaction_id,
            'id_user': i.id_user,
            'shoe_detail_id': i.shoe_detail_id,
            'interaction_type': i.interaction_type.value,
            'interaction_date': i.interaction_date
        } for i in interactions
    ]), 200

@user_interaction_bp.route('/user_interactions', methods=['POST'])
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

    # # Jalankan pelatihan model setelah data berhasil disimpan
    # try:
    #     train_model()  # Fungsi ini menjalankan skrip pelatihan model
    #     return jsonify({'message': 'Interaction recorded and model trained successfully'}), 201
    # except Exception as e:
    #     return jsonify({'message': f'Interaction recorded but error during model training: {str(e)}'}), 500

@user_interaction_bp.route('/user_interactions/<int:interaction_id>', methods=['PUT'])
def update_interaction(interaction_id):
    data = request.json
    interaction = UserInteraction.query.get(interaction_id)
    if not interaction:
        return jsonify({'message': 'Interaction not found'}), 404
    interaction.interaction_type = InteractionType[data['interaction_type']]
    interaction.interaction_date = get_current_time_wita()
    db.session.commit()
    return jsonify({'message': 'Interaction updated successfully'}), 200

@user_interaction_bp.route('/user_interactions/<int:interaction_id>', methods=['DELETE'])
def delete_interaction(interaction_id):
    interaction = UserInteraction.query.get(interaction_id)
    if not interaction:
        return jsonify({'message': 'Interaction not found'}), 404
    db.session.delete(interaction)
    db.session.commit()
    return jsonify({'message': 'Interaction deleted successfully'}), 200
