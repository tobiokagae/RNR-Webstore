from flask import Blueprint, request, jsonify
from models import db, Order, User, ShoeDetail
from datetime import datetime
import pytz

orders_bp = Blueprint('orders', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@orders_bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json

    # Pengecekan apakah user_id ada di tabel User
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({'message': 'User ID does not exist'}), 400

    # Pengecekan apakah shoe_detail_id ada di tabel ShoeDetail (optional, jika perlu)
    shoe_detail = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe_detail:
        return jsonify({'message': 'Shoe Detail ID does not exist'}), 400

    # Konversi string tanggal menjadi objek datetime
    try:
        order_date = datetime.strptime(data['order_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_order = Order(
        user_id=data['user_id'],
        shoe_detail_id=data['shoe_detail_id'],
        order_date=order_date,
        amount=data['amount'],
        order_status=data['order_status'],
        last_updated=get_current_time_wita()
    )
    try:
        db.session.add(new_order)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

    return jsonify({'message': 'Order created successfully'}), 201

@orders_bp.route('/api/orders/<int:order_id>', methods=['DELETE'])
def cancel_order(order_id):
    order = Order.query.get(order_id)
    if order:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order cancelled successfully'}), 200
    return jsonify({'message': 'Order not found'}), 404

@orders_bp.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    order = Order.query.get(order_id)
    if order:
        order.order_status = data.get('order_status', order.order_status)
        order.last_updated = get_current_time_wita()
        db.session.commit()
        return jsonify({'message': 'Order status updated successfully'}), 200
    return jsonify({'message': 'Order not found'}), 404

@orders_bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get(order_id)
    if order:
        return jsonify({
            'order_id': order.order_id,
            'user_id': order.user_id,
            'shoe_detail_id': order.shoe_detail_id,
            'order_date': order.order_date,
            'amount': order.amount,
            'order_status': order.order_status,
            'last_updated': order.last_updated
        }), 200
    return jsonify({'message': 'Order not found'}), 404

@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    if orders:
        result = []
        for order in orders:
            result.append({
                'order_id': order.order_id,
                'user_id': order.user_id,
                'shoe_detail_id': order.shoe_detail_id,
                'order_date': order.order_date,
                'amount': order.amount,
                'order_status': order.order_status,
                'last_updated': order.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'No orders found'}), 404
