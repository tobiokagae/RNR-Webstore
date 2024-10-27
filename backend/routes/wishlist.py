from flask import Blueprint, request, jsonify
from models import db, Wishlist, User, ShoeDetail  # Pastikan User dan ShoeDetail diimpor
from datetime import datetime
import pytz

wishlist_bp = Blueprint('wishlist', __name__)

def get_current_time_wita():
    # Mengambil waktu saat ini di zona waktu WITA
    wita_tz = pytz.timezone('Asia/Makassar') 
    return datetime.now(wita_tz)

@wishlist_bp.route('/api/wishlist/<int:user_id>', methods=['GET'])
def get_wishlist(user_id):
    wishlist_items = Wishlist.query.filter_by(id_user=user_id).all()
    if wishlist_items:
        result = []
        for item in wishlist_items:
            result.append({
                'id_wishlist': item.id_wishlist,
                'id_shoe': item.id_shoe,
                'id_user': item.id_user,
                'date_added': item.date_added
            })
        return jsonify(result), 200
    return jsonify({'message': 'Wishlist is empty'}), 404

@wishlist_bp.route('/api/wishlist', methods=['POST'])
def add_to_wishlist():
    data = request.json
    
    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    shoe = ShoeDetail.query.get(data['id_shoe'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404
    
    new_item = Wishlist(
        id_shoe=data['id_shoe'],
        id_user=data['id_user'],
        date_added=get_current_time_wita()
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item added to wishlist successfully'}), 201

@wishlist_bp.route('/api/wishlist/<int:id_wishlist>', methods=['DELETE'])
def remove_from_wishlist(id_wishlist):
    item = Wishlist.query.get(id_wishlist)
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item removed from wishlist successfully'}), 200
    return jsonify({'message': 'Item not found'}), 404

@wishlist_bp.route('/api/wishlist/<int:id_wishlist>', methods=['PUT'])
def update_wishlist(id_wishlist):
    data = request.json
    item = Wishlist.query.get(id_wishlist)
    if item:
        item.id_shoe = data.get('id_shoe', item.id_shoe)
        item.id_user = data.get('id_user', item.id_user)
        item.date_added = get_current_time_wita()
        db.session.commit()
        return jsonify({'message': 'Wishlist updated successfully'}), 200
    return jsonify({'message': 'Item not found'}), 404

@wishlist_bp.route('/api/wishlist/item/<int:id_wishlist>', methods=['GET'])
def get_wishlist_item(id_wishlist):
    item = Wishlist.query.get(id_wishlist)
    if item:
        return jsonify({
            'id_wishlist': item.id_wishlist,
            'id_shoe': item.id_shoe,
            'id_user': item.id_user,
            'date_added': item.date_added
        }), 200
    return jsonify({'message': 'Item not found'}), 404

@wishlist_bp.route('/api/wishlist', methods=['GET'])
def get_all_wishlist_items():
    wishlist_items = Wishlist.query.all()
    result = []
    for item in wishlist_items:
        result.append({
            'id_wishlist': item.id_wishlist,
            'id_shoe': item.id_shoe,
            'id_user': item.id_user,
            'date_added': item.date_added.isoformat()
        })
    return jsonify(result), 200