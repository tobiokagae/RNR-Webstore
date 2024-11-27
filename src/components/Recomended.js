import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Recomended.css";

function Recomended() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mengambil user_id dari localStorage
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not found");
      setLoading(false);
      return;
    }

    // Fungsi untuk mengambil rekomendasi sepatu
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shoe_recommendations/${userId}`
        );

        // Memeriksa status respon
        if (!response.data || response.data.length === 0) {
          setError("No recommendations found");
          setLoading(false);
          return;
        }

        // Mengambil detail sepatu untuk setiap rekomendasi
        const shoeDetails = response.data.map((rec) => ({
          id: rec.shoe_detail_id,
          shoeName: rec.shoe_name,
          shoePrice: rec.shoe_price,
          shoeSize: rec.shoe_size,
          stock: rec.stock,
          categoryId: rec.category_id,
          dateAdded: rec.date_added,
          lastUpdated: rec.last_updated,
        }));

        setProducts(shoeDetails);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recommendations. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // Hanya dijalankan sekali saat komponen dimount

  // Jika sedang loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Jika ada error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recomended-page max-w-7xl mx-auto p-6">
      <h1 className="recomended-title text-4xl font-bold text-center mb-8">
        Recommended for You
      </h1>
      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            className="product-card bg-white shadow-lg rounded-lg overflow-hidden"
            key={product.id}
          >
            <img
              src={`/images/shoes/${product.id}.jpg`} // Asumsikan gambar diambil berdasarkan id
              alt={product.shoeName}
              className="product-image w-full h-64 object-cover"
            />
            <div className="product-details p-4">
              <p className="product-category text-sm text-gray-500">
                {product.categoryId} {/* Menampilkan kategori berdasarkan id */}
              </p>
              <p className="product-name text-lg font-semibold mt-2">
                {product.shoeName}
              </p>
              <p className="product-price text-xl font-bold text-gray-900 mt-2">
                <span className="original-price text-sm text-gray-500 line-through">
                  {/* Menampilkan harga asli jika ada */}
                  {product.originalPrice}
                </span>
                <br />
                {product.shoePrice}
              </p>
              <div className="flex mt-4 gap-4">
                <button className="cart-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  +
                </button>
                <button className="wishlist-btn text-red-500 hover:text-red-600 text-xl">
                  ❤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recomended;
