from flask import Blueprint, request, jsonify
from models import db, Wallet, User 
from datetime import datetime, timedelta
import pytz

wallet_bp = Blueprint('wallet', __name__)

def get_current_time_wita():
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

def get_current_time_wita():
    # Mendapatkan waktu saat ini dalam zona waktu WITA (UTC+8)
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

@wallet_bp.route('/api/wallet/<int:id_wallet>', methods=['GET'])
def get_wallet(id_wallet):
    wallet = Wallet.query.filter_by(id_wallet=id_wallet).first()
    if wallet:
        return jsonify({
            'id_wallet': wallet.id_wallet,
            'id_user': wallet.id_user,
            'balance': wallet.balance,
            'last_updated': wallet.last_updated,
            'currency': wallet.currency
        }), 200
    return jsonify({'message': 'Wallet not found'}), 404

@wallet_bp.route('/api/wallet', methods=['POST'])
def add_wallet():
    data = request.json
    
    user = User.query.get(data['id_user'])
    if not user:
        return jsonify({'message': 'User not found'}), 404

    existing_wallet = Wallet.query.filter_by(id_user=data['id_user']).first()
    if existing_wallet:
        return jsonify({'message': 'Wallet already exists for this user'}), 400

    new_wallet = Wallet(
        id_user=data['id_user'],
        balance=data['balance'],
        last_updated=get_current_time_wita(),
        currency=data['currency']
    )
    db.session.add(new_wallet)
    db.session.commit()
    return jsonify({'message': 'Wallet added successfully'}), 201

@wallet_bp.route('/api/wallet/<int:id_wallet>', methods=['DELETE'])
def remove_wallet(id_wallet):
    wallet = Wallet.query.get(id_wallet)
    if wallet:
        db.session.delete(wallet)
        db.session.commit()
        return jsonify({'message': 'Wallet removed successfully'}), 200
    return jsonify({'message': 'Wallet not found'}), 404

@wallet_bp.route('/api/wallet/<int:id_wallet>', methods=['PUT'])
def update_wallet(id_wallet):
    data = request.json
    wallet = Wallet.query.get(id_wallet)
    if wallet:
        wallet.balance = data.get('balance', wallet.balance)
        wallet.last_updated = get_current_time_wita()
        wallet.currency = data.get('currency', wallet.currency)
        db.session.commit()
        return jsonify({'message': 'Wallet updated successfully'}), 200
    return jsonify({'message': 'Wallet not found'}), 404

@wallet_bp.route('/api/wallet/item/<int:id_wallet>', methods=['GET'])
def get_wallet_item(id_wallet):
    wallet = Wallet.query.get(id_wallet)
    if wallet:
        return jsonify({
            'id_wallet': wallet.id_wallet,
            'id_user': wallet.id_user,
            'balance': wallet.balance,
            'last_updated': wallet.last_updated,
            'currency': wallet.currency
        }), 200
    return jsonify({'message': 'Wallet not found'}), 404

@wallet_bp.route('/api/wallet', methods=['GET'])
def get_all_wallets():
    wallets = Wallet.query.all()
    result = []
    for wallet in wallets:
        result.append({
            'id_wallet': wallet.id_wallet,
            'id_user': wallet.id_user,
            'balance': wallet.balance,
            'last_updated': wallet.last_updated,
            'currency': wallet.currency
        })
    return jsonify(result), 200
