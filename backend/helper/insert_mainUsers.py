import sqlite3
from datetime import datetime

# Ganti dengan path file database SQLite Anda
db_path = 'D:\\Kuliah\\V\\RNR-Webstore\\backend\\instance\\site.db'

# Membuka koneksi ke database SQLite
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Kosongkan tabel user terlebih dahulu
cursor.execute("DELETE FROM user")

# Menambahkan 1 admin dan 1 user
# Data untuk admin
admin_username = 'admin'
admin_password = 'adminpassword'
admin_email = 'admin@example.com'
admin_address = 'Admin Address'
admin_phone = '0812345678'
admin_first_name = 'Admin'
admin_last_name = 'User'
admin_role = 'Admin'
date_added = last_updated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Menyisipkan admin
cursor.execute('''
    INSERT INTO user (username, password, email, address, phone, first_name, last_name, role, date_added, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', (admin_username, admin_password, admin_email, admin_address, admin_phone, admin_first_name, admin_last_name, admin_role, date_added, last_updated))

# Data untuk user
user_username = 'user1'
user_password = 'userpassword1'
user_email = 'user1@example.com'
user_address = 'User Address'
user_phone = '0812345679'
user_first_name = 'User'
user_last_name = 'One'
user_role = 'User'

# Menyisipkan user
cursor.execute('''
    INSERT INTO user (username, password, email, address, phone, first_name, last_name, role, date_added, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', (user_username, user_password, user_email, user_address, user_phone, user_first_name, user_last_name, user_role, date_added, last_updated))

# Commit perubahan dan menutup koneksi
conn.commit()
conn.close()

print("1 admin and 1 user inserted successfully!")
