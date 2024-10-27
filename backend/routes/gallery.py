from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Gallery, ShoeDetail
import pytz

gallery_bp = Blueprint('gallery', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@gallery_bp.route('/api/gallery', methods=['POST'])
def add_image():
    data = request.json

    # Pengecekan apakah shoe_detail_id ada di tabel ShoeDetail
    shoe_detail = ShoeDetail.query.get(data['shoe_detail_id'])
    if not shoe_detail:
        return jsonify({'message': 'Shoe Detail ID does not exist'}), 400

    new_image = Gallery(
        shoe_detail_id=data['shoe_detail_id'],
        image_url=data['image_url'],
        date_added=get_current_time_wita(),
        last_updated=get_current_time_wita()
    )
    db.session.add(new_image)
    db.session.commit()
    return jsonify({'message': 'Image added successfully'}), 201

@gallery_bp.route('/api/gallery/<int:gallery_id>', methods=['PUT'])
def update_image(gallery_id):
    data = request.json
    image = Gallery.query.get(gallery_id)
    if image:
        # Pengecekan apakah shoe_detail_id ada di tabel ShoeDetail
        if 'shoe_detail_id' in data:
            shoe_detail = ShoeDetail.query.get(data['shoe_detail_id'])
            if not shoe_detail:
                return jsonify({'message': 'Shoe Detail ID does not exist'}), 400
            image.shoe_detail_id = data['shoe_detail_id']
            image.last_updated = get_current_time_wita()
        
        image.image_url = data.get('image_url', image.image_url)
        db.session.commit()
        return jsonify({'message': 'Image updated successfully'}), 200
    return jsonify({'message': 'Image not found'}), 404

@gallery_bp.route('/api/gallery/<int:gallery_id>', methods=['DELETE'])
def remove_image(gallery_id):
    image = Gallery.query.get(gallery_id)
    if image:
        db.session.delete(image)
        db.session.commit()
        return jsonify({'message': 'Image removed successfully'}), 200
    return jsonify({'message': 'Image not found'}), 404

@gallery_bp.route('/api/gallery/<int:gallery_id>', methods=['GET'])
def get_image(gallery_id):
    image = Gallery.query.get(gallery_id)
    if image:
        return jsonify({
            'gallery_id': image.gallery_id,
            'shoe_detail_id': image.shoe_detail_id,
            'image_url': image.image_url,
            'date_added' : image.date_added,
            'last_updated' : image.last_updated
        }), 200
    return jsonify({'message': 'Image not found'}), 404

@gallery_bp.route('/api/gallery', methods=['GET'])
def get_all_images():
    images = Gallery.query.all()
    if images:
        result = []
        for image in images:
            result.append({
                'gallery_id': image.gallery_id,
                'shoe_detail_id': image.shoe_detail_id,
                'image_url': image.image_url,
                'date_added' : image.date_added,
                'last_updated' : image.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'No images found'}), 404
