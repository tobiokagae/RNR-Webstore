from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Cart, User, ShoeDetail, UserInteraction
from datetime import datetime
import pytz

cart_bp = Blueprint('cart', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar') 
    return datetime.now(wita_tz)

@cart_bp.route('/api/cart/<int:user_id>', methods=['GET'])
@jwt_required()  # Menambahkan dekorator jwt_required
def get_cart(user_id):
    current_user = get_jwt_identity()  # Mendapatkan user dari token JWT
    if current_user != user_id:
        return jsonify({'message': 'You are not authorized to view this cart'}), 403
    
    cart_items = Cart.query.filter_by(id_user=user_id).all()
    if cart_items:
        result = []
        for item in cart_items:
            shoe = ShoeDetail.query.get(item.shoe_detail_id)
            if shoe:
                result.append({
                    'id_cart': item.id_cart,
                    'shoe_detail_id': item.shoe_detail_id,
                    'id_user': item.id_user,
                    'quantity': item.quantity,
                    'shoe_name': shoe.shoe_name,
                    'shoe_price': shoe.shoe_price,
                    'shoe_size': shoe.shoe_size,
                    'stock': shoe.stock,
                    'date_added': item.date_added,
                    'last_updated': item.last_updated
                })
        return jsonify(result), 200
    return jsonify({'message': 'Cart is empty'}), 404

@cart_bp.route('/api/cart', methods=['POST'])
@jwt_required()  # JWT untuk autentikasi
def add_to_cart():
    data = request.json
    current_user = get_jwt_identity()

    # Validasi input
    if not data.get('shoe_detail_id') or not data.get('quantity'):
        return jsonify({'message': 'Shoe detail ID and quantity are required'}), 400
    
    # Ambil user dan shoe detail
    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    shoe = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    # Periksa stok
    if shoe.stock < data['quantity']:
        return jsonify({'message': 'Insufficient stock available'}), 400

    # Periksa jika item sudah ada di cart, tambahkan quantity jika ada
    existing_item = Cart.query.filter_by(id_user=data['id_user'], shoe_detail_id=data['shoe_detail_id']).first()
    if existing_item:
        existing_item.quantity += data['quantity']  # Update quantity
        existing_item.last_updated = get_current_time_wita()
        message = 'Item quantity updated in cart'
    else:
        # Buat item baru jika tidak ada
        new_item = Cart(
            shoe_detail_id=data['shoe_detail_id'],
            id_user=data['id_user'],
            quantity=data['quantity'],
            date_added=get_current_time_wita(),
            last_updated=get_current_time_wita()
        )
        db.session.add(new_item)
        message = 'Item added to cart successfully'

    # Catat interaksi pengguna
    new_interaction = UserInteraction(
        id_user=data['id_user'],
        shoe_detail_id=data['shoe_detail_id'],
        interaction_type='cart',
        interaction_date=get_current_time_wita()
    )
    db.session.add(new_interaction)

    db.session.commit()
    return jsonify({'message': message}), 200 if existing_item else 201

@cart_bp.route('/api/cart/<int:id_cart>', methods=['DELETE'])
@jwt_required()  # Menambahkan dekorator jwt_required
def remove_from_cart(id_cart):
    current_user = get_jwt_identity()
    item = Cart.query.get(id_cart)
    
    if item and item.id_user == current_user:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart successfully'}), 200
    
    return jsonify({'message': 'Item not found or unauthorized'}), 404

@cart_bp.route('/api/cart/<int:id_cart>', methods=['PUT'])
@jwt_required()  # Menambahkan dekorator jwt_required
def update_cart(id_cart):
    data = request.json
    current_user = get_jwt_identity()
    
    item = Cart.query.get(id_cart)
    if item and item.id_user == current_user:
        user = User.query.get(data.get('id_user', item.id_user))
        if not user:
            return jsonify({'message': 'User not found'}), 404

        shoe = ShoeDetail.query.get(data.get('shoe_detail_id', item.shoe_detail_id))
        if not shoe:
            return jsonify({'message': 'Shoe not found'}), 404

        if shoe.stock < data.get('quantity', item.quantity):
            return jsonify({'message': 'Not enough stock'}), 400

        item.shoe_detail_id = data.get('shoe_detail_id', item.shoe_detail_id)
        item.id_user = data.get('id_user', item.id_user)
        item.quantity = data.get('quantity', item.quantity)
        item.last_updated = get_current_time_wita()

        db.session.commit()
        return jsonify({'message': 'Cart updated successfully'}), 200

    return jsonify({'message': 'Item not found or unauthorized'}), 404

@cart_bp.route('/api/cart/item/<int:id_cart>', methods=['GET'])
@jwt_required()  # Menambahkan dekorator jwt_required
def get_cart_item(id_cart):
    current_user = get_jwt_identity()
    item = Cart.query.get(id_cart)
    
    if item and item.id_user == current_user:
        shoe = ShoeDetail.query.get(item.shoe_detail_id)
        if shoe:
            return jsonify({
                'id_cart': item.id_cart,
                'shoe_detail_id': item.shoe_detail_id,
                'id_user': item.id_user,
                'quantity': item.quantity,
                'shoe_name': shoe.shoe_name,
                'shoe_price': shoe.shoe_price,
                'shoe_size': shoe.shoe_size,
                'stock': shoe.stock,
                'date_added': item.date_added,
                'last_updated': item.last_updated
            }), 200
        else:
            return jsonify({'message': 'Shoe not found'}), 404
    return jsonify({'message': 'Item not found or unauthorized'}), 404

@cart_bp.route('/api/cart', methods=['GET'])
@jwt_required()  # Menambahkan dekorator jwt_required
def get_all_cart_items():
    current_user = get_jwt_identity()
    cart_items = Cart.query.filter_by(id_user=current_user).all()
    result = []
    for item in cart_items:
        shoe = ShoeDetail.query.get(item.shoe_detail_id)
        if shoe:
            result.append({
                'id_cart': item.id_cart,
                'shoe_detail_id': item.shoe_detail_id,
                'id_user': item.id_user,
                'quantity': item.quantity,
                'shoe_name': shoe.shoe_name,
                'shoe_price': shoe.shoe_price,
                'shoe_size': shoe.shoe_size,
                'stock': shoe.stock,
                'date_added': item.date_added,
                'last_updated': item.last_updated
            })
    return jsonify(result), 200
