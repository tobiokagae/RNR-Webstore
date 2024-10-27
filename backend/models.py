from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz
import enum

db = SQLAlchemy()

def get_current_time_wita():
    # Mengambil waktu saat ini di zona waktu WITA
    wita_tz = pytz.timezone('Asia/Makassar')
    return datetime.now(wita_tz)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    first_name = db.Column(db.String(80), nullable=True, default=" ")
    last_name = db.Column(db.String(80), nullable=True, default=" ")
    role = db.Column(db.String(50), nullable=True, default="User")
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Order(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    order_status = db.Column(db.String(50), nullable=False)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Payment(db.Model):
    payment_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.order_id'), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)
    payment_date = db.Column(db.Date, nullable=False)

class ShoeDetail(db.Model):
    shoe_detail_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('shoe_category.category_id'), nullable=False)
    shoe_name = db.Column(db.String(100), nullable=False)
    shoe_price = db.Column(db.Float, nullable=False)
    shoe_size = db.Column(db.String(10), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class ShoeCategory(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Gallery(db.Model):
    gallery_id = db.Column(db.Integer, primary_key=True)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Cart(db.Model):
    id_cart = db.Column(db.Integer, primary_key=True)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Wishlist(db.Model):
    id_wishlist = db.Column(db.Integer, primary_key=True)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)

class Wallet(db.Model):
    id_wallet = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    balance = db.Column(db.Numeric(10, 2), nullable=False, default=0.0)
    currency = db.Column(db.String(10), nullable=False, default='USD')
    last_updated = db.Column(db.DateTime, default=get_current_time_wita, onupdate=get_current_time_wita)

class Discount(db.Model):
    id_discount = db.Column(db.Integer, primary_key=True)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    discount_code = db.Column(db.String(50), unique=True, nullable=False)
    discount_value = db.Column(db.Numeric(5, 2), nullable=False)
    date_added = db.Column(db.DateTime, default=get_current_time_wita)
    expiration_date = db.Column(db.Date, nullable=False)

# Enum untuk jenis interaksi
class InteractionType(enum.Enum):
    view = "view"
    wishlist = "wishlist"
    cart = "cart"
    order = "order"

class UserInteraction(db.Model):
    interaction_id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    shoe_detail_id = db.Column(db.Integer, db.ForeignKey('shoe_detail.shoe_detail_id'), nullable=False)
    interaction_type = db.Column(db.Enum(InteractionType), nullable=False)  # Menggunakan Enum untuk jenis interaksi
    interaction_date = db.Column(db.DateTime, default=get_current_time_wita)
