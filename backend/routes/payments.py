from flask import Blueprint, request, jsonify
from models import db, Payment, Order
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/api/payments', methods=['POST'])
def process_payment():
    data = request.json

    # Validasi input
    if not data or 'order_id' not in data or 'payment_method' not in data or 'payment_status' not in data or 'payment_date' not in data:
        return jsonify({'message': 'Missing data in request'}), 400

    try:
        payment_date = datetime.strptime(data['payment_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    # Pengecekan apakah order_id ada di tabel Order
    order = Order.query.get(data['order_id'])
    if not order:
        return jsonify({'message': 'Order ID does not exist'}), 400

    # Pengecekan apakah sudah ada pembayaran dengan order_id yang sama
    existing_payment = Payment.query.filter_by(order_id=data['order_id']).first()
    if existing_payment:
        return jsonify({'message': 'Payment Is Already Done'}), 400

    new_payment = Payment(
        order_id=data['order_id'],
        payment_method=data['payment_method'],
        payment_status=data['payment_status'],
        payment_date=payment_date
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({'message': 'Payment processed successfully'}), 201

@payments_bp.route('/api/payments/<int:payment_id>', methods=['PUT'])
def update_payment_status(payment_id):
    data = request.json
    payment = Payment.query.get(payment_id)
    if payment:
        if 'payment_status' in data:
            payment.payment_status = data['payment_status']
            db.session.commit()
            return jsonify({'message': 'Payment status updated successfully'}), 200
        return jsonify({'message': 'No payment status provided'}), 400
    return jsonify({'message': 'Payment not found'}), 404

@payments_bp.route('/api/payments/<int:payment_id>', methods=['GET'])
def get_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if payment:
        return jsonify({
            'payment_id': payment.payment_id,
            'order_id': payment.order_id,
            'payment_method': payment.payment_method,
            'payment_status': payment.payment_status,
            'payment_date': payment.payment_date.strftime('%Y-%m-%d')  # Format tanggal
        }), 200
    return jsonify({'message': 'Payment not found'}), 404

@payments_bp.route('/api/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    if payments:
        result = [{
            'payment_id': payment.payment_id,
            'order_id': payment.order_id,
            'payment_method': payment.payment_method,
            'payment_status': payment.payment_status,
            'payment_date': payment.payment_date.strftime('%Y-%m-%d')  # Format tanggal
        } for payment in payments]
        return jsonify(result), 200
    return jsonify({'message': 'No payments found'}), 404

@payments_bp.route('/api/payments/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if payment:
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted successfully'}), 200
    return jsonify({'message': 'Payment not found'}), 404
