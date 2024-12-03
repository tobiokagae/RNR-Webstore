import pandas as pd
from sqlalchemy import create_engine
from sklearn.decomposition import NMF
from imblearn.over_sampling import SMOTE
from models import ShoeRecomendationForUsers, db
import joblib
import logging
import numpy as np
from sklearn.preprocessing import StandardScaler

# Menambahkan pengaturan logging untuk melacak progres dan error
logging.basicConfig(level=logging.DEBUG)

def train_nmf_model():
    # Tentukan jalur file database SQLite Anda
    database_path = r'D:\Kuliah\V\RNR-Webstore\backend\instance\site.db'
    
    # Membuat koneksi ke database SQLite menggunakan SQLAlchemy
    engine = create_engine(f'sqlite:///{database_path}')

    try:
        # Membaca data interaksi pengguna dari tabel 'user_interaction' di database
        user_interactions = pd.read_sql_table('user_interaction', engine)
        logging.info(f'Data berhasil dibaca: {user_interactions.shape[0]} baris')
    except Exception as e:
        # Menangani jika ada error saat membaca data
        logging.error(f'Error saat membaca data: {e}')
        raise

    # Mengubah kolom 'interaction_type' menjadi format numerik (0 untuk view/wishlist, 1 untuk cart/order)
    user_interactions['interaction_type'] = user_interactions['interaction_type'].map({
        'view': 0, 'wishlist': 0, 'cart': 1, 'order': 1
    }).fillna(0)  # Mengisi nilai kosong dengan 0 (interaksi tidak terjadi)

    # Menangani missing values dengan mengisi nilai kosong dengan rata-rata dari kolom yang sesuai
    user_interactions = user_interactions.fillna(user_interactions.mean()).drop_duplicates()

    # Menentukan fitur (X) dan target (y)
    X = user_interactions[['id_user', 'shoe_detail_id']]  # Fitur menggunakan id_user dan shoe_detail_id
    y = user_interactions['interaction_type']  # Target berupa interaction_type (0 atau 1)

    # Membuat matriks user-item, di mana baris adalah pengguna dan kolom adalah sepatu, dengan nilai interaksi
    user_item_matrix = pd.pivot_table(user_interactions, index='id_user', columns='shoe_detail_id', values='interaction_type', fill_value=0)
    logging.info(f'Matriks interaksi pengguna-sepatu berukuran: {user_item_matrix.shape}')

    # Menggunakan SMOTE untuk melakukan oversampling pada kelas minoritas
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)

    # Membuat model NMF (Non-negative Matrix Factorization) untuk dekomposisi matriks
    nmf_model = NMF(n_components=20, init='random', random_state=42, solver='mu', max_iter=200)

    try:
        # Melatih model NMF dengan matriks interaksi pengguna-sepatu
        nmf_model.fit(user_item_matrix)
        logging.info("Model NMF berhasil dilatih.")
    except Exception as e:
        # Menangani error yang terjadi saat melatih model
        logging.error(f'Error saat melatih model NMF: {e}')
        raise

    # Transformasi matriks user-item ke dalam bentuk matriks faktor pengguna (W) dan item (H)
    W = nmf_model.transform(user_item_matrix)  # Matriks faktor pengguna
    H = nmf_model.components_  # Matriks faktor item

    # Menghitung prediksi interaksi pengguna dengan item (sepatu) berdasarkan faktor yang diperoleh
    predicted_interactions = np.dot(W, H)
    # Mengubah hasil prediksi menjadi DataFrame untuk memudahkan pengolahan lebih lanjut
    recommendation_df = pd.DataFrame(predicted_interactions, columns=user_item_matrix.columns)
    logging.info(f'Rekomendasi pertama: {recommendation_df.head()}')

    # Mengambil 10 sepatu teratas berdasarkan nilai prediksi tertinggi untuk setiap pengguna
    recommended_shoes = recommendation_df.apply(lambda row: row.nlargest(10).index.tolist(), axis=1)

    # Menyimpan hasil rekomendasi ke dalam database
    try:
        with db.session.begin():
            # Menghapus data rekomendasi sebelumnya dari tabel ShoeRecomendationForUsers
            db.session.query(ShoeRecomendationForUsers).delete()
            # Menyimpan rekomendasi sepatu untuk setiap pengguna ke dalam tabel database
            for user_id, shoes in recommended_shoes.items():
                for shoe in shoes:
                    # Memeriksa apakah rekomendasi sepatu untuk pengguna sudah ada di database
                    existing_recommendation = db.session.query(ShoeRecomendationForUsers).filter_by(id_user=user_id, shoe_detail_id=shoe).first()
                    if not existing_recommendation:
                        # Jika belum ada, menambahkan rekomendasi baru ke database
                        new_recommendation = ShoeRecomendationForUsers(id_user=user_id, shoe_detail_id=shoe)
                        db.session.add(new_recommendation)
            db.session.commit()
            logging.info('Hasil rekomendasi berhasil disimpan ke database.')
    except Exception as e:
        # Menangani error saat menyimpan hasil rekomendasi ke database
        logging.error(f'Error saat menyimpan hasil rekomendasi: {e}')
        raise

    # Menyimpan model NMF ke dalam file menggunakan joblib
    try:
        joblib.dump(nmf_model, 'nmf_model.pkl')
        logging.info("Model NMF berhasil disimpan!")
    except Exception as e:
        # Menangani error saat menyimpan model
        logging.error(f'Error saat menyimpan model NMF: {e}')
        raise
