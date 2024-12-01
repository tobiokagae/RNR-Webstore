from flask import Blueprint, request, jsonify
from models import ShoeDetail, User, db, UserInteraction, InteractionType
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
    # Pastikan kita mengambil data JSON menggunakan get_json()
    data = request.get_json()

    # Debug: cek data yang diterima
    print(data)

    # Pastikan id_user, shoe_detail_id dan interaction_type ada dalam data
    if 'id_user' not in data or 'shoe_detail_id' not in data or 'interaction_type' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    # Validasi id_user: Periksa apakah id_user ada di database
    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Validasi shoe_detail_id: Periksa apakah shoe_detail_id ada di database
    shoe = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    # Validasi interaction_type: Periksa apakah interaction_type valid
    try:
        interaction_type = InteractionType[data['interaction_type']]
    except KeyError:
        return jsonify({'message': 'Invalid interaction type'}), 400

    try:
        # Menambahkan interaksi ke database
        new_interaction = UserInteraction(
            id_user=data['id_user'],
            shoe_detail_id=data['shoe_detail_id'],
            interaction_type=interaction_type,
            interaction_date=get_current_time_wita()
        )
        db.session.add(new_interaction)
        db.session.commit()

        return jsonify({'message': 'Interaction recorded successfully'}), 201
    except Exception as e:
        print(f"Error: {str(e)}")  # Tambahkan log untuk mengecek error lebih detail
        return jsonify({'message': f'Error: {str(e)}'}), 500

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
