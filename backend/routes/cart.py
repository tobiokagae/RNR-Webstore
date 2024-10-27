from flask import Blueprint, request, jsonify
from models import db, Cart, User, ShoeDetail
from datetime import datetime, timedelta
import pytz

cart_bp = Blueprint('cart', __name__)

def get_current_time_wita():
    # Mengambil waktu saat ini di zona waktu WITA
    wita_tz = pytz.timezone('Asia/Makassar') 
    return datetime.now(wita_tz)

@cart_bp.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = Cart.query.filter_by(id_user=user_id).all()
    if cart_items:
        result = []
        for item in cart_items:
            result.append({
                'id_cart': item.id_cart,
                'id_shoe': item.id_shoe,
                'id_user': item.id_user,
                'quantity': item.quantity,
                'date_added': item.date_added,
                'last_updated': item.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'Cart is empty'}), 404

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.json

    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    shoe = ShoeDetail.query.get(data['id_shoe'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    # Cek apakah item sudah ada di keranjang
    existing_item = Cart.query.filter_by(id_user=data['id_user'], id_shoe=data['id_shoe']).first()
    if existing_item:
        return jsonify({'message': 'Item already in cart'}), 400

    new_item = Cart(
        id_shoe=data['id_shoe'],
        id_user=data['id_user'],
        quantity=data['quantity'],
        date_added=get_current_time_wita(),
        last_updated=get_current_time_wita()
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'}), 201

@cart_bp.route('/api/cart/<int:id_cart>', methods=['DELETE'])
def remove_from_cart(id_cart):
    item = Cart.query.get(id_cart)
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    return jsonify({'message': 'Item not found'}), 404

@cart_bp.route('/api/cart/<int:id_cart>', methods=['PUT'])
def update_cart(id_cart):
    data = request.json
    item = Cart.query.get(id_cart)

    if item:
        user = User.query.get(data.get('id_user', item.id_user))
        if not user:
            return jsonify({'message': 'User not found'}), 404

        shoe = ShoeDetail.query.get(data.get('id_shoe', item.id_shoe))
        if not shoe:
            return jsonify({'message': 'Shoe not found'}), 404

        item.id_shoe = data.get('id_shoe', item.id_shoe)
        item.id_user = data.get('id_user', item.id_user)
        item.quantity = data.get('quantity', item.quantity)
        item.last_updated = get_current_time_wita()

        db.session.commit()
        return jsonify({'message': 'Cart updated successfully'}), 200

    return jsonify({'message': 'Item not found'}), 404

@cart_bp.route('/api/cart/item/<int:id_cart>', methods=['GET'])
def get_cart_item(id_cart):
    item = Cart.query.get(id_cart)
    if item:
        return jsonify({
            'id_cart': item.id_cart,
            'id_shoe': item.id_shoe,
            'id_user': item.id_user,
            'quantity': item.quantity,
            'date_added': item.date_added,
            'last_updated': item.last_updated
        }), 200
    return jsonify({'message': 'Item not found'}), 404

@cart_bp.route('/api/cart', methods=['GET'])
def get_all_cart_items():
    cart_items = Cart.query.all()
    result = []
    for item in cart_items:
        result.append({
            'id_cart': item.id_cart,
            'id_shoe': item.id_shoe,
            'id_user': item.id_user,
            'quantity': item.quantity,
            'date_added': item.date_added,
            'last_updated': item.last_updated
        })
    return jsonify(result), 200
