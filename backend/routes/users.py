from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from datetime import datetime
import pytz

users_bp = Blueprint('users', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@users_bp.route('/api/users/register', methods=['POST'])
def register():
    data = request.json

    # Validasi input
    if not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({'message': 'Username, password, and email are required'}), 400

    # Cek apakah username sudah ada
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409
    
    # Hash password dengan pbkdf2:sha256
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    # Buat pengguna baru
    new_user = User(
        username=data['username'],
        password=hashed_password,
        email=data['email'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        role=data.get('role', 'User')
    )
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Login Pengguna
@users_bp.route('/api/users/login', methods=['POST'])
def login():
    data = request.json

    # Validasi input
    if not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    
    # Cari user berdasarkan username
    user = User.query.filter_by(username=data['username']).first()
    
    # Cek apakah password benar
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'message': 'Login successful',
            'username': user.username,
            'role': user.role  # Pastikan role juga dikembalikan
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Update Profil Pengguna
@users_bp.route('/api/users/profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    new_username = data.get('username', user.username)

    # Cek apakah username sudah ada di database untuk user lain
    existing_user = User.query.filter(User.username == new_username, User.user_id != user_id).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409

    # Jika username tidak duplikat, lanjutkan update profil
    user.username = new_username
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.address = data.get('address', user.address)
    user.phone = data.get('phone', user.phone)
    user.last_updated = get_current_time_wita()
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200


# Logout Pengguna
@users_bp.route('/api/users/logout', methods=['POST'])
def logout():
    # Implementasi logout (misalnya, hapus sesi) bisa ditambahkan di sini
    return jsonify({'message': 'Logged out successfully'}), 200

# Mendapatkan Informasi Pengguna berdasarkan ID
@users_bp.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'address': user.address,
            'phone': user.phone,
            'role': user.role,
            'date_added': user.date_added,
            'last_updated' : user.last_updated
        }), 200
    return jsonify({'message': 'User not found'}), 404

# Mendapatkan Semua Pengguna
@users_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    if users:
        result = []
        for user in users:
            result.append({
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'address': user.address,
                'phone': user.phone,
                'role': user.role,
                'date_added': user.date_added,
                'last_updated' : user.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'No users found'}), 404

# Hapus Pengguna berdasarkan ID
@users_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404
