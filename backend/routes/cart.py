# cart_routes.py
from flask import Blueprint, request, jsonify
from models import db, Cart, User, ShoeDetail, UserInteraction
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
            shoe = ShoeDetail.query.get(item.shoe_detail_id)  # Ambil data sepatu berdasarkan shoe_detail_id
            if shoe:
                result.append({
                    'id_cart': item.id_cart,
                    'shoe_detail_id': item.shoe_detail_id,
                    'id_user': item.id_user,
                    'quantity': item.quantity,
                    'shoe_name': shoe.shoe_name,   # Menambahkan nama sepatu
                    'shoe_price': shoe.shoe_price, # Menambahkan harga sepatu
                    'shoe_size': shoe.shoe_size,   # Menambahkan ukuran sepatu
                    'stock': shoe.stock,           # Menambahkan stok sepatu
                    'date_added': item.date_added,
                    'last_updated': item.last_updated
                })
            else:
                # Jika sepatu tidak ditemukan, kirimkan pesan kesalahan
                result.append({
                    'id_cart': item.id_cart,
                    'message': 'Shoe not found'
                })
        return jsonify(result), 200
    return jsonify({'message': 'Cart is empty'}), 404

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.json

    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    shoe = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    existing_item = Cart.query.filter_by(id_user=data['id_user'], shoe_detail_id=data['shoe_detail_id']).first()
    if existing_item:
        return jsonify({'message': 'Item already in cart'}), 400

    new_item = Cart(
        shoe_detail_id=data['shoe_detail_id'],
        id_user=data['id_user'],
        quantity=data['quantity'],
        date_added=get_current_time_wita(),
        last_updated=get_current_time_wita()
    )

    new_interaction = UserInteraction(
        id_user=data['id_user'],
        shoe_detail_id=data['shoe_detail_id'],
        interaction_type='cart',
        interaction_date=get_current_time_wita()
    )

    db.session.add(new_item)
    db.session.add(new_interaction)
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

        shoe = ShoeDetail.query.get(data.get('shoe_detail_id', item.shoe_detail_id))
        if not shoe:
            return jsonify({'message': 'Shoe not found'}), 404

        item.shoe_detail_id = data.get('shoe_detail_id', item.shoe_detail_id)
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
        shoe = ShoeDetail.query.get(item.shoe_detail_id)  # Ambil data sepatu berdasarkan shoe_detail_id
        if shoe:
            return jsonify({
                'id_cart': item.id_cart,
                'shoe_detail_id': item.shoe_detail_id,
                'id_user': item.id_user,
                'quantity': item.quantity,
                'shoe_name': shoe.shoe_name,   # Nama sepatu
                'shoe_price': shoe.shoe_price, # Harga sepatu
                'shoe_size': shoe.shoe_size,   # Ukuran sepatu
                'stock': shoe.stock,           # Stok sepatu
                'date_added': item.date_added,
                'last_updated': item.last_updated
            }), 200
        else:
            return jsonify({'message': 'Shoe not found'}), 404
    return jsonify({'message': 'Item not found'}), 404

@cart_bp.route('/api/cart', methods=['GET'])
def get_all_cart_items():
    cart_items = Cart.query.all()
    result = []
    for item in cart_items:
        shoe = ShoeDetail.query.get(item.shoe_detail_id)  # Ambil data sepatu berdasarkan shoe_detail_id
        if shoe:
            result.append({
                'id_cart': item.id_cart,
                'shoe_detail_id': item.shoe_detail_id,
                'id_user': item.id_user,
                'quantity': item.quantity,
                'shoe_name': shoe.shoe_name,   # Nama sepatu
                'shoe_price': shoe.shoe_price, # Harga sepatu
                'shoe_size': shoe.shoe_size,   # Ukuran sepatu
                'stock': shoe.stock,           # Stok sepatu
                'date_added': item.date_added,
                'last_updated': item.last_updated
            })
    return jsonify(result), 200
