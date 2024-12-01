from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User
from datetime import datetime
import pytz

# Inisialisasi Blueprint
users_bp = Blueprint('users', __name__)

# Fungsi untuk mendapatkan waktu WITA
def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)


# Function For Registration
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
    
    # Hash password
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

# Function for Login 
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
        access_token = create_access_token(identity=user.user_id)
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'username': user.username,
            'role': user.role,
            'user_id': user.user_id
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Function for Update Profile User
@users_bp.route('/api/users/profile/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Permission denied'}), 403
    
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Cek apakah username sudah digunakan oleh user lain
    new_username = data.get('username', user.username)
    existing_user = User.query.filter(User.username == new_username, User.user_id != user_id).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409

    # Update data profil
    user.username = new_username
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.address = data.get('address', user.address)
    user.phone = data.get('phone', user.phone)
    user.last_updated = get_current_time_wita()
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

# Function for Logout User
@users_bp.route('/api/users/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

# Functon for Get User By ID
@users_bp.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()
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

# Function for Get All Users
@users_bp.route('/api/users', methods=['GET'])
# @jwt_required()  # Uncomment jika hanya admin yang boleh mengakses
def get_users():
    users = User.query.all()
    if users:
        result = [{
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
        } for user in users]
        return jsonify(result), 200
    return jsonify({'message': 'No users found'}), 404

# Function for Delete User By ID
@users_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Pastikan hanya admin yang bisa mengakses
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404
