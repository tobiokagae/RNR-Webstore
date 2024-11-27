import sqlite3
import random
import enum
from datetime import datetime, timedelta

# Enum untuk jenis interaksi
class InteractionType(enum.Enum):
    view = "view"
    wishlist = "wishlist"
    cart = "cart"
    order = "order"

# Fungsi untuk mendapatkan waktu saat ini (WITA)
def get_current_time_wita():
    # Menggunakan waktu UTC dan menambah 8 jam untuk WITA (UTC +8)
    return datetime.utcnow() + timedelta(hours=8)

# Ganti dengan path file database SQLite Anda (gunakan raw string literals atau double backslash)
db_path = r'D:\Kuliah\V\RNR-Webstore\backend\instance\site.db'

# Membuka koneksi ke database SQLite
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Kosongkan tabel user_interaction terlebih dahulu
cursor.execute("DELETE FROM user_interaction")

# Menyiapkan data untuk dimasukkan ke dalam tabel UserInteraction
query = '''
WITH RECURSIVE generate_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM generate_series WHERE n <= 10000  -- Perbanyak data interaksi (10000 data)
)
INSERT INTO user_interaction (id_user, shoe_detail_id, interaction_type, interaction_date)
SELECT
    (n % 25) + 1 AS id_user,  -- Menggunakan user_id dari 1 sampai 25 (25 user)
    (n % 5) + 1 AS shoe_detail_id,  -- Menggunakan shoe_detail_id dari 1 sampai 5 (contoh)
    CASE
        WHEN n % 5 = 0 THEN 'view'  -- 40% untuk order (1 dari 5 data)
        WHEN n % 5 = 1 THEN 'cart'   -- 40% untuk cart (1 dari 5 data)
        ELSE 'order'                  -- 20% untuk view (3 dari 5 data)
    END AS interaction_type,
    CURRENT_TIMESTAMP AS interaction_date
FROM generate_series;
'''

# Menjalankan query
cursor.execute(query)

# Commit perubahan dan menutup koneksi
conn.commit()
conn.close()

print("User interactions inserted successfully with user_id up to 25!")
