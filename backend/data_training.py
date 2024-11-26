import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import StratifiedShuffleSplit, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import joblib
from flask import current_app
from app import app, db
from models import ShoeDetail, ShoeRecomendationForUsers, User
import numpy as np

# Ganti dengan jalur absolut ke file database SQLite Anda
database_path = r'D:\Kuliah\V\RNR-Webstore\backend\instance\site.db'

# Membuat engine untuk menghubungkan ke SQLite
engine = create_engine(f'sqlite:///{database_path}')

# Membaca data dari tabel user_interaction
try:
    user_interactions = pd.read_sql_table('user_interaction', engine)
    print(f'Data berhasil dibaca: {user_interactions.shape[0]} baris')
except Exception as e:
    print(f'Error saat membaca data: {e}')

# Mengubah jenis interaksi menjadi nilai biner untuk prediksi pembelian
user_interactions['interaction_type'] = user_interactions['interaction_type'].map({
    'view': 0,      # View tidak dianggap sebagai interaksi kuat
    'wishlist': 0,  # Wishlist lebih ke preferensi
    'cart': 1,      # Cart berarti pengguna tertarik
    'order': 1     # Order berarti pembelian
}).fillna(0)  # Menangani nilai yang tidak dikenali

# Memastikan tidak ada missing values
user_interactions = user_interactions.fillna(user_interactions.mean())

# Menyiapkan fitur dan target (id_user dan shoe_detail_id sebagai fitur, interaction_type sebagai target)
X = user_interactions[['id_user', 'shoe_detail_id']]  # Fitur
y = user_interactions['interaction_type']  # Target (apakah interaksi terjadi)

# Membagi data menjadi data latih dan data uji secara stratifikasi
splitter = StratifiedShuffleSplit(n_splits=1, test_size=0.3, random_state=42)
for train_idx, test_idx in splitter.split(X, y):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

# Standarisasi data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Melakukan cross-validation untuk memastikan model tidak overfit
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')

# Menggunakan 3-fold cross-validation jika data hanya 4 sampel
cv_scores = cross_val_score(model, X, y, cv=3, scoring='accuracy')
print(f"Accuracy per fold: {cv_scores}")
print(f"Average Accuracy: {np.mean(cv_scores):.4f}")

# Mencari parameter terbaik dengan GridSearchCV
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# Gunakan 3-fold cross-validation di GridSearchCV
grid_search = GridSearchCV(estimator=RandomForestClassifier(random_state=42),
                           param_grid=param_grid,
                           cv=3,  # 3-fold cross-validation
                           scoring='accuracy',
                           n_jobs=-1,
                           verbose=2)

# Melatih dengan pencarian grid
grid_search.fit(X_train_scaled, y_train)

# Menampilkan hasil terbaik
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best cross-validation accuracy: {grid_search.best_score_:.4f}")

# Menggunakan parameter terbaik untuk melatih model
best_model = grid_search.best_estimator_

# Melatih model dengan parameter terbaik
best_model.fit(X_train_scaled, y_train)

# Memprediksi data uji
y_pred = best_model.predict(X_test_scaled)

# Evaluasi model
print(f'Akurasi: {accuracy_score(y_test, y_pred):.4f}')
print('Laporan Klasifikasi:\n', classification_report(y_test, y_pred))

# Menampilkan confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Not Purchased', 'Purchased'], yticklabels=['Not Purchased', 'Purchased'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()

# Menyimpan model
joblib.dump(best_model, 'user_interaction_model.pkl')
print("Model berhasil disimpan!")

# Menghapus isi tabel shoe_recommendation_for_users sebelum menambah data baru
with app.app_context():  # Menggunakan aplikasi context
    try:
        # Memulai transaksi dan menghapus data
        db.session.query(ShoeRecomendationForUsers).delete()  # Menghapus semua data dalam tabel
        db.session.commit()  # Pastikan untuk melakukan commit agar perubahan diterapkan
        print("Tabel shoe_recommendation_for_user berhasil dikosongkan.")
    except Exception as e:
        print(f'Error saat mengosongkan tabel: {e}')

# Mengubah hasil prediksi menjadi dataframe
recommendation_df = pd.DataFrame({
    'id_user': X_test['id_user'],
    'shoe_detail_id': X_test['shoe_detail_id'],
    'predicted_action': y_pred
})

# Menyimpan hasil ke database (tabel ShoeRecommendationForUser)
with app.app_context():
    try:
        # Simpan rekomendasi ke dalam database
        for _, row in recommendation_df.iterrows():
            try:
                id_user = int(row['id_user'])
                shoe_detail_id = int(row['shoe_detail_id'])

                # Cek keberadaan user dan sepatu
                user_exists = db.session.query(User).filter(User.user_id == id_user).first()
                shoe_exists = db.session.query(ShoeDetail).filter(ShoeDetail.shoe_detail_id == shoe_detail_id).first()

                # Menyimpan jika valid
                if user_exists and shoe_exists:
                    new_recommendation = ShoeRecomendationForUsers(
                        id_user=id_user,
                        shoe_detail_id=shoe_detail_id
                    )
                    db.session.add(new_recommendation)
                else:
                    print(f"Data tidak valid: user_exists={user_exists}, shoe_exists={shoe_exists} untuk id_user={id_user} dan shoe_detail_id={shoe_detail_id}")

            except ValueError as ve:
                print(f"Error dalam konversi tipe data: {ve} untuk id_user={row['id_user']} atau shoe_detail_id={row['shoe_detail_id']}")

        # Commit setelah semua data diproses
        db.session.commit()
        print('Hasil rekomendasi berhasil disimpan ke database.')
    
    except Exception as e:
        print(f'Error saat memeriksa data validitas atau menyimpan data: {e}')
