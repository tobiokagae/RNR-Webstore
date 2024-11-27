from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User
from datetime import datetime
import pytz

# Inisialisasi Blueprint
users_bp = Blueprint('users', __name__)

# Inisialisasi JWT Manager
def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

# Register User
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
        # Generate JWT token
        access_token = create_access_token(identity=user.user_id)
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,  # Token untuk autentikasi
            'username': user.username,
            'role': user.role,
            'user_id': user.user_id
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401


# Update Profil Pengguna
@users_bp.route('/api/users/profile/<int:user_id>', methods=['PUT'])
@jwt_required()  # Pastikan hanya user yang login yang bisa mengakses
def update_profile(user_id):
    # Memastikan ID pengguna yang melakukan permintaan sesuai dengan ID yang terdaftar
    current_user_id = get_jwt_identity()  # Mendapatkan ID pengguna dari token JWT
    if current_user_id != user_id:
        return jsonify({'message': 'Permission denied'}), 403
    
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    new_username = data.get('username', user.username)

    # Cek apakah username sudah ada di database untuk user lain
    existing_user = User.query.filter(User.username == new_username, User.user_id != user_id).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409

    # Update profil pengguna
    user.username = new_username
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.address = data.get('address', user.address)
    user.phone = data.get('phone', user.phone)
    user.last_updated = get_current_time_wita()
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200


# Logout Pengguna (token invalidation di sisi client)
@users_bp.route('/api/users/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200


# Mendapatkan Informasi Pengguna berdasarkan ID
@users_bp.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()  # Pastikan hanya user yang login yang bisa mengakses
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
            'last_updated': user.last_updated
        }), 200
    return jsonify({'message': 'User not found'}), 404

# Mendapatkan Semua Pengguna
@users_bp.route('/api/users', methods=['GET'])
# @jwt_required()  # Pastikan hanya admin yang bisa mengakses
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
                'last_updated': user.last_updated
            })
        return jsonify(result), 200
    return jsonify({'message': 'No users found'}), 404

# Hapus Pengguna berdasarkan ID
@users_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Pastikan hanya admin yang bisa mengakses
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404
