from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, ShoeDetail, ShoeCategory
import pytz

shoes_bp = Blueprint('shoes', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@shoes_bp.route('/api/shoes', methods=['POST'])
def add_shoe_detail():
    data = request.json
    category = ShoeCategory.query.get(data['category_id'])
    if not category:
        return jsonify({'message': 'Category ID does not exist'}), 400
    
    new_shoe = ShoeDetail(
        category_id=data['category_id'],
        shoe_name=data['shoe_name'],
        shoe_price=data['shoe_price'],
        shoe_size=data['shoe_size'],
        stock=data['stock'],
        date_added=get_current_time_wita(),
        last_updated=get_current_time_wita()
    )

    db.session.add(new_shoe)
    db.session.commit()
    
    # Mengirimkan shoe_detail_id dalam respons
    return jsonify({
        'message': 'Shoe detail added successfully',
        'shoe_detail_id': new_shoe.shoe_detail_id
    }), 201

@shoes_bp.route('/api/shoes/<int:shoe_detail_id>', methods=['PUT'])
def update_shoe_detail(shoe_detail_id):
    data = request.json
    shoe = ShoeDetail.query.get(shoe_detail_id)
    if not shoe:
        return jsonify({'message': 'Shoe detail not found'}), 404
    
    if 'category_id' in data:
        category = ShoeCategory.query.get(data['category_id'])
        if not category:
            return jsonify({'message': 'Category ID does not exist'}), 400
        shoe.category_id = data['category_id']
    
    shoe.shoe_name = data.get('shoe_name', shoe.shoe_name)
    shoe.shoe_price = data.get('shoe_price', shoe.shoe_price)
    shoe.shoe_size = data.get('shoe_size', shoe.shoe_size)
    shoe.stock = data.get('stock', shoe.stock)
    shoe.last_updated = get_current_time_wita()
    
    db.session.commit()
    return jsonify({'message': 'Shoe detail updated successfully'}), 200

@shoes_bp.route('/api/shoes/<int:shoe_detail_id>', methods=['DELETE'])
def delete_shoe_detail(shoe_detail_id):
    shoe = ShoeDetail.query.get(shoe_detail_id)
    if shoe:
        db.session.delete(shoe)
        db.session.commit()
        return jsonify({'message': 'Shoe detail deleted successfully'}), 200
    return jsonify({'message': 'Shoe detail not found'}), 404

@shoes_bp.route('/api/shoes/<int:shoe_detail_id>', methods=['GET'])
def get_shoe_detail(shoe_detail_id):
    shoe = ShoeDetail.query.get(shoe_detail_id)
    if shoe:
        return jsonify({
            'shoe_detail_id': shoe.shoe_detail_id,
            'category_id': shoe.category_id,
            'shoe_name': shoe.shoe_name,
            'shoe_price': shoe.shoe_price,
            'shoe_size': shoe.shoe_size,
            'stock': shoe.stock,
            'date_added': shoe.date_added,
            'last_updated': shoe.last_updated,
        }), 200
    return jsonify({'message': 'Shoe detail not found'}), 404

@shoes_bp.route('/api/shoes', methods=['GET'])
def get_all_shoes():
    shoes = ShoeDetail.query.all()
    if shoes:
        result = []
        for shoe in shoes:
            result.append({
                'shoe_detail_id': shoe.shoe_detail_id,
                'category_id': shoe.category_id,
                'shoe_name': shoe.shoe_name,
                'shoe_price': shoe.shoe_price,
                'shoe_size': shoe.shoe_size,
                'stock': shoe.stock,
                'date_added': shoe.date_added,
                'last_updated': shoe.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'No Shoe detail found'}), 404
