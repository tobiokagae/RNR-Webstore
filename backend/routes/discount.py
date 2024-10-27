from flask import Blueprint, request, jsonify
from models import db, Discount, ShoeDetail
from datetime import datetime
import pytz

discount_bp = Blueprint('discount', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@discount_bp.route('/api/discount', methods=['POST'])
def add_discount():
    data = request.json

    # Validasi input
    if not all(key in data for key in ('id_shoe', 'discount_code', 'discount_value', 'expiration_date')):
        return jsonify({'message': 'Missing data'}), 400

    shoe = ShoeDetail.query.get(data['id_shoe'])
    if not shoe:
        return jsonify({'message': 'Shoe not found'}), 404

    # Menggunakan try-except untuk menangani kesalahan parsing tanggal
    try:
        expiration_date = datetime.strptime(data['expiration_date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid expiration date format. Use YYYY-MM-DD.'}), 400

    # Cek apakah tanggal kadaluarsa sudah lewat
    if expiration_date < datetime.utcnow():
        return jsonify({'message': 'Expiration date must be in the future.'}), 400

    new_discount = Discount(
        id_shoe=data['id_shoe'],
        discount_code=data['discount_code'],
        discount_value=data['discount_value'],
        date_added=get_current_time_wita(),
        expiration_date=expiration_date
    )
    db.session.add(new_discount)
    db.session.commit()
    return jsonify({'message': 'Discount added successfully'}), 201

@discount_bp.route('/api/discount/<int:id_discount>', methods=['DELETE'])
def remove_discount(id_discount):
    discount = Discount.query.get(id_discount)
    if discount:
        db.session.delete(discount)
        db.session.commit()
        return jsonify({'message': 'Discount removed successfully'}), 200
    return jsonify({'message': 'Discount not found'}), 404

@discount_bp.route('/api/discount/<int:id_discount>', methods=['PUT'])
def update_discount(id_discount):
    data = request.json

    # Validasi input
    if not any(key in data for key in ('id_shoe', 'discount_code', 'discount_value', 'expiration_date')):
        return jsonify({'message': 'Missing data'}), 400

    shoe = ShoeDetail.query.get(data.get('id_shoe'))
    if shoe is None:
        return jsonify({'message': 'Shoe not found'}), 404

    discount = Discount.query.get(id_discount)
    if discount:
        discount.id_shoe = data.get('id_shoe', discount.id_shoe)
        discount.discount_code = data.get('discount_code', discount.discount_code)
        discount.discount_value = data.get('discount_value', discount.discount_value)

        # Update expiration_date dengan validasi
        if 'expiration_date' in data:
            try:
                new_expiration_date = datetime.strptime(data['expiration_date'], '%Y-%m-%d')
                if new_expiration_date < datetime.utcnow():
                    return jsonify({'message': 'Expiration date must be in the future.'}), 400
                discount.expiration_date = new_expiration_date
            except ValueError:
                return jsonify({'message': 'Invalid expiration date format. Use YYYY-MM-DD.'}), 400

        db.session.commit()
        return jsonify({'message': 'Discount updated successfully'}), 200
    return jsonify({'message': 'Discount not found'}), 404

@discount_bp.route('/api/discount/<int:id_discount>', methods=['GET'])
def get_discount(id_discount):
    discount = Discount.query.get(id_discount)
    if discount:
        return jsonify({
            'id_discount': discount.id_discount,
            'id_shoe': discount.id_shoe,
            'discount_code': discount.discount_code,
            'discount_value': discount.discount_value,
            'date_added': discount.date_added,
            'expiration_date': discount.expiration_date.strftime('%Y-%m-%d'),
        }), 200
    return jsonify({'message': 'Discount not found'}), 404

@discount_bp.route('/api/discount', methods=['GET'])
def get_discounts():
    discounts = Discount.query.all()
    result = []
    for discount in discounts:
        result.append({
            'id_discount': discount.id_discount,
            'id_shoe': discount.id_shoe,
            'discount_code': discount.discount_code,
            'discount_value': discount.discount_value,
            'date_added': discount.date_added,
            'expiration_date': discount.expiration_date.strftime('%Y-%m-%d'),
        })
    return jsonify(result), 200

