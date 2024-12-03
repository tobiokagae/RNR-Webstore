from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, User, ShoeDetail, UserInteraction
from datetime import datetime
import pytz

orders_bp = Blueprint('orders', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@orders_bp.route('/api/orders', methods=['POST'])
@jwt_required()  # Memerlukan JWT
def create_order():
    data = request.json
    user_id = get_jwt_identity()  # Ambil user_id dari token JWT

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not authenticated or does not exist'}), 400

    shoe_detail = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe_detail:
        return jsonify({'message': 'Shoe Detail ID does not exist'}), 400

    try:
        order_date = datetime.strptime(data['order_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_order = Order(
        user_id=user_id,
        shoe_detail_id=data['shoe_detail_id'],
        order_status=data['order_status'],
        order_date=order_date,
        amount=data['amount'],
        last_updated=get_current_time_wita()
    )

    new_interaction = UserInteraction(
        id_user=user_id,
        shoe_detail_id=data['shoe_detail_id'],
        interaction_type='order',
        interaction_date=get_current_time_wita()
    )

    db.session.add(new_order)
    db.session.add(new_interaction)
    db.session.commit()

    return jsonify({'message': 'Order created successfully'}), 201

@orders_bp.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    return jsonify([
        {
            'order_id': order.order_id,
            'user_id': order.user_id,
            'shoe_detail_id': order.shoe_detail_id,
            'order_status': order.order_status,
            'order_date': order.order_date.isoformat(),
            'amount': order.amount
        } for order in orders
    ])

# Endpoint lainnya ditambahkan jwt_required serupa
@orders_bp.route('/api/orders/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_orders_for_user(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()
    order_data = []
    
    for order in orders:
        shoe_detail = ShoeDetail.query.get(order.shoe_detail_id)
        order_data.append({
            'order_id': order.order_id,
            'user_id': order.user_id,
            'shoe_detail_id': order.shoe_detail_id,
            'shoe_name': shoe_detail.shoe_name,  # Menambahkan nama sepatu
            'order_status': order.order_status,
            'order_date': order.order_date.isoformat(),
            'amount': order.amount
        })
    
    return jsonify(order_data)


@orders_bp.route('/api/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    return jsonify({'message': 'Order not found'}), 404
