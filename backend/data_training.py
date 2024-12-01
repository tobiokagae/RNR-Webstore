# data_training.py

import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import NMF
import numpy as np
from imblearn.over_sampling import SMOTE
from models import ShoeRecomendationForUsers, db
import joblib
import logging

# Menambahkan pengaturan logging
logging.basicConfig(level=logging.DEBUG)

def train_nmf_model():
    # Ganti dengan jalur absolut ke file database SQLite Anda
    database_path = r'D:\Kuliah\V\RNR-Webstore\backend\instance\site.db'

    # Membuat engine untuk menghubungkan ke SQLite
    engine = create_engine(f'sqlite:///{database_path}')

    try:
        user_interactions = pd.read_sql_table('user_interaction', engine)
        logging.info(f'Data berhasil dibaca: {user_interactions.shape[0]} baris')
    except Exception as e:
        logging.error(f'Error saat membaca data: {e}')
        raise Exception(f'Error saat membaca data: {e}')

    # Mengubah jenis interaksi menjadi nilai biner untuk prediksi pembelian
    user_interactions['interaction_type'] = user_interactions['interaction_type'].map({
        'view': 0,      # View tidak dianggap sebagai interaksi kuat
        'wishlist': 0,  # Wishlist lebih ke preferensi
        'cart': 1,      # Cart berarti pengguna tertarik
        'order': 1      # Order berarti pembelian
    }).fillna(0)  # Menangani nilai yang tidak dikenali

    # Memastikan tidak ada missing values
    user_interactions = user_interactions.fillna(user_interactions.mean())

    # Menghapus duplikat data yang sudah ada
    user_interactions = user_interactions.drop_duplicates()

    # Menyiapkan fitur dan target (id_user dan shoe_detail_id sebagai fitur, interaction_type sebagai target)
    X = user_interactions[['id_user', 'shoe_detail_id']]  # Fitur
    y = user_interactions['interaction_type']  # Target (apakah interaksi terjadi)

    # Membuat matriks pengguna-sepatu (user-item matrix)
    user_item_matrix = pd.pivot_table(user_interactions, index='id_user', columns='shoe_detail_id', values='interaction_type', fill_value=0)

    logging.info(f'Matriks interaksi pengguna-sepatu berukuran: {user_item_matrix.shape}')

    # Menggunakan SMOTE untuk oversampling (untuk menghindari duplikasi langsung)
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)

    # Membagi data menjadi data latih dan data uji secara stratifikasi
    splitter = StratifiedShuffleSplit(n_splits=1, test_size=0.3, random_state=42)
    for train_idx, test_idx in splitter.split(X_resampled, y_resampled):
        X_train, X_test = X_resampled.iloc[train_idx], X_resampled.iloc[test_idx]
        y_train, y_test = y_resampled.iloc[train_idx], y_resampled.iloc[test_idx]

    # Standarisasi data (tidak terlalu dibutuhkan untuk NMF, karena ini adalah dekomposisi matriks)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Model NMF
    nmf_model = NMF(n_components=5, init='random', random_state=42)

    # Melatih model NMF dengan matriks interaksi
    try:
        nmf_model.fit(user_item_matrix)
        logging.info("Model NMF berhasil dilatih.")
    except Exception as e:
        logging.error(f'Error saat melatih model NMF: {e}')
        raise Exception(f'Error saat melatih model NMF: {e}')

    # Menghasilkan rekomendasi berdasarkan model NMF
    W = nmf_model.transform(user_item_matrix)  # Matriks user-factors
    H = nmf_model.components_  # Matriks item-factors

    # Prediksi interaksi antara pengguna dan sepatu berdasarkan faktor
    predicted_interactions = np.dot(W, H)

    # Mengubah hasil prediksi menjadi dataframe
    recommendation_df = pd.DataFrame(predicted_interactions, columns=user_item_matrix.columns)

    # Menampilkan rekomendasi untuk beberapa pengguna pertama
    logging.info(f'Rekomendasi pertama: {recommendation_df.head()}')

    # Mengambil rekomendasi sepatu berdasarkan prediksi yang lebih tinggi (akan menjadi pembelian)
    recommended_shoes = recommendation_df.apply(lambda row: row.nlargest(10).index.tolist(), axis=1)

    # Menyimpan hasil ke database (tabel ShoeRecommendationForUser)
    try:
        with db.session.begin():
            # Mengosongkan tabel sebelumnya
            db.session.query(ShoeRecomendationForUsers).delete()

            # Menyimpan hasil rekomendasi ke dalam database
            for user_id, shoes in recommended_shoes.items():
                for shoe in shoes:
                    new_recommendation = ShoeRecomendationForUsers(
                        id_user=user_id,
                        shoe_detail_id=shoe
                    )
                    db.session.add(new_recommendation)

            db.session.commit()
            logging.info('Hasil rekomendasi berhasil disimpan ke database.')
    except Exception as e:
        logging.error(f'Error saat menyimpan hasil rekomendasi: {e}')
        raise Exception(f'Error saat menyimpan hasil rekomendasi: {e}')

    # Menyimpan model NMF
    try:
        joblib.dump(nmf_model, 'nmf_model.pkl')
        logging.info("Model NMF berhasil disimpan!")
    except Exception as e:
        logging.error(f'Error saat menyimpan model NMF: {e}')
        raise Exception(f'Error saat menyimpan model NMF: {e}')