from flask import Blueprint, request, jsonify
from models import db, ShoeRecomendationForUsers, User, ShoeDetail
from datetime import datetime
import pytz

shoe_recommendation_bp = Blueprint('shoe_recommendation', __name__)

def get_current_time_wita():
    # Mengambil waktu saat ini di zona waktu WITA
    wita_tz = pytz.timezone('Asia/Makassar') 
    return datetime.now(wita_tz)

@shoe_recommendation_bp.route('/api/shoe_recommendations/<int:user_id>', methods=['GET'])
def get_recommendations_for_user(user_id):
    recommendations = ShoeRecomendationForUsers.query.filter_by(id_user=user_id).all()
    if recommendations:
        result = []
        for rec in recommendations:
            shoe = ShoeDetail.query.get(rec.shoe_detail_id)
            if shoe:
                result.append({
                    'id_shoe_recomendation': rec.id_shoe_recomendation,
                    'id_user': rec.id_user,
                    'shoe_detail_id': rec.shoe_detail_id,
                    'shoe_name': shoe.shoe_name,
                    'shoe_price': shoe.shoe_price,
                    'shoe_size': shoe.shoe_size,
                    'stock': shoe.stock,
                    'date_added': shoe.date_added,
                    'last_updated': shoe.last_updated
                })
        return jsonify(result), 200
    return jsonify({'message': 'No recommendations found for this user'}), 404

@shoe_recommendation_bp.route('/api/shoe_recommendations', methods=['POST'])
def add_recommendation():
    data = request.json

    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    shoe = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    existing_recommendation = ShoeRecomendationForUsers.query.filter_by(id_user=data['id_user'], shoe_detail_id=data['shoe_detail_id']).first()
    if existing_recommendation:
        return jsonify({'message': 'Recommendation already exists'}), 400

    new_recommendation = ShoeRecomendationForUsers(
        id_user=data['id_user'],
        shoe_detail_id=data['shoe_detail_id']
    )

    db.session.add(new_recommendation)
    db.session.commit()
    return jsonify({'message': 'Recommendation added successfully'}), 201

@shoe_recommendation_bp.route('/api/shoe_recommendations/<int:id_shoe_recomendation>', methods=['DELETE'])
def remove_recommendation(id_shoe_recomendation):
    recommendation = ShoeRecomendationForUsers.query.get(id_shoe_recomendation)
    if recommendation:
        db.session.delete(recommendation)
        db.session.commit()
        return jsonify({'message': 'Recommendation removed successfully'}), 200
    return jsonify({'message': 'Recommendation not found'}), 404

@shoe_recommendation_bp.route('/api/shoe_recommendations/<int:id_shoe_recomendation>', methods=['PUT'])
def update_recommendation(id_shoe_recomendation):
    data = request.json
    recommendation = ShoeRecomendationForUsers.query.get(id_shoe_recomendation)

    if recommendation:
        user = User.query.get(data.get('id_user', recommendation.id_user))
        if not user:
            return jsonify({'message': 'User not found'}), 404

        shoe = ShoeDetail.query.get(data.get('shoe_detail_id', recommendation.shoe_detail_id))
        if not shoe:
            return jsonify({'message': 'Shoe not found'}), 404

        recommendation.id_user = data.get('id_user', recommendation.id_user)
        recommendation.shoe_detail_id = data.get('shoe_detail_id', recommendation.shoe_detail_id)

        db.session.commit()
        return jsonify({'message': 'Recommendation updated successfully'}), 200

    return jsonify({'message': 'Recommendation not found'}), 404

@shoe_recommendation_bp.route('/api/shoe_recommendations/<int:id_shoe_recomendation>', methods=['GET'])
def get_recommendation(id_shoe_recomendation):
    recommendation = ShoeRecomendationForUsers.query.get(id_shoe_recomendation)
    if recommendation:
        shoe = ShoeDetail.query.get(recommendation.shoe_detail_id)
        if shoe:
            return jsonify({
                'id_shoe_recomendation': recommendation.id_shoe_recomendation,
                'id_user': recommendation.id_user,
                'shoe_detail_id': recommendation.shoe_detail_id,
                'shoe_name': shoe.shoe_name,
                'shoe_price': shoe.shoe_price,
                'shoe_size': shoe.shoe_size,
                'stock': shoe.stock,
                'date_added': shoe.date_added,
                'last_updated': shoe.last_updated
            }), 200
    return jsonify({'message': 'Recommendation not found'}), 404

@shoe_recommendation_bp.route('/api/shoe_recommendations', methods=['GET'])
def get_all_recommendations():
    recommendations = ShoeRecomendationForUsers.query.all()
    result = []
    for rec in recommendations:
        shoe = ShoeDetail.query.get(rec.shoe_detail_id)
        if shoe:
            result.append({
                'id_shoe_recomendation': rec.id_shoe_recomendation,
                'id_user': rec.id_user,
                'shoe_detail_id': rec.shoe_detail_id,
                'shoe_name': shoe.shoe_name,
                'shoe_price': shoe.shoe_price,
                'shoe_size': shoe.shoe_size,
                'stock': shoe.stock,
                'date_added': shoe.date_added,
                'last_updated': shoe.last_updated
            })
    return jsonify(result), 200
