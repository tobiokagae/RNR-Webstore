from flask import Blueprint, request, jsonify
from models import db, Order, User, ShoeDetail, UserInteraction
from datetime import datetime
import pytz

orders_bp = Blueprint('orders', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@orders_bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json

    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({'message': 'User ID does not exist'}), 400

    shoe_detail = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe_detail:
        return jsonify({'message': 'Shoe Detail ID does not exist'}), 400

    try:
        order_date = datetime.strptime(data['order_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_order = Order(
        user_id=data['user_id'],
        shoe_detail_id=data['shoe_detail_id'],
        order_status=data['order_status'],
        order_date=order_date,
        amount=data['amount'],
        last_updated=get_current_time_wita()
    )

    new_interaction = UserInteraction(
        id_user=data['user_id'],
        shoe_detail_id=data['shoe_detail_id'],
        interaction_type='order',
        interaction_date=get_current_time_wita()
    )

    db.session.add(new_order)
    db.session.add(new_interaction)
    db.session.commit()

    return jsonify({'message': 'Order created successfully'}), 201

@orders_bp.route('/api/orders', methods=['GET'])
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

@orders_bp.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    order = Order.query.get(order_id)

    if order:
        order.order_status = data.get('order_status', order.order_status)
        
        if 'order_date' in data:
            try:
                order.order_date = datetime.strptime(data['order_date'], '%Y-%m-%d')
            except ValueError:
                return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

        order.last_updated = get_current_time_wita()
        db.session.commit()
        return jsonify({'message': 'Order status updated successfully'}), 200

    return jsonify({'message': 'Order not found'}), 404

@orders_bp.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    return jsonify({'message': 'Order not found'}), 404
