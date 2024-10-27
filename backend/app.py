from flask import Flask, jsonify
from config import Config
from models import db
from flask_migrate import Migrate
from flask_cors import CORS
from routes.users import users_bp
from routes.orders import orders_bp
from routes.payments import payments_bp
from routes.shoes import shoes_bp
from routes.categories import categories_bp
from routes.gallery import gallery_bp
from routes.wallet import wallet_bp
from routes.cart import cart_bp
from routes.wishlist import wishlist_bp
from routes.discount import discount_bp

app = Flask(__name__)
app.config.from_object(Config)

# Inisialisasi database
db.init_app(app)

# Inisialisasi Flask-Migrate untuk migrasi database
migrate = Migrate(app, db)

# Mengaktifkan CORS untuk seluruh aplikasi Flask
CORS(app)

# Register blueprint untuk berbagai route
app.register_blueprint(users_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(payments_bp)
app.register_blueprint(shoes_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(gallery_bp)
app.register_blueprint(wallet_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(wishlist_bp)
app.register_blueprint(discount_bp)

# Menambahkan error handler global
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"message": "Internal server error"}), 500

# Menjalankan aplikasi Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
