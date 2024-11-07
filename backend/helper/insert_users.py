import sqlite3

# Ganti dengan path file database SQLite Anda
db_path = 'D:\\Kuliah\\V\\RNR-Webstore\\backend\\instance\\site.db'

# Membuka koneksi ke database SQLite
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Kosongkan tabel user_interaction terlebih dahulu
cursor.execute("DELETE FROM user")

# Query untuk insert 100 data pengguna
query = '''
WITH RECURSIVE generate_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM generate_series WHERE n < 100
)
INSERT INTO user (username, password, email, address, phone, first_name, last_name, role, date_added, last_updated)
SELECT
    'user_' || n AS username,
    'password' || n AS password,
    'user' || n || '@example.com' AS email,
    'Address ' || n AS address,
    '081234567' || n AS phone,
    'FirstName' AS first_name,
    'LastName' AS last_name,
    'User' AS role,
    CURRENT_TIMESTAMP AS date_added,
    CURRENT_TIMESTAMP AS last_updated
FROM generate_series;
'''

# Menjalankan query
cursor.execute(query)

# Commit perubahan dan menutup koneksi
conn.commit()
conn.close()

print("100 users inserted successfully!")
