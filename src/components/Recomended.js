import React, { useState, useEffect } from "react";
import axios from "axios";

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
    return <div className="text-center py-4">Loading...</div>;
  }

  // Jika ada error
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="recomended-page max-w-7xl mx-auto px-4 py-8">
      <h1 className="recomended-title text-4xl font-bold text-center text-gray-800 mb-8">
        Recommended for You
      </h1>
      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-black p-4">
        {products.map((product) => (
          <div
            className="product-card bg-blue-500 text-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
            key={product.id}>
            {/* Gambar Produk */}
            <div className="image-container w-full h-48 bg-white">
              <img
                src={`/images/${product.shoeName}.jpg`}
                alt={product.shoeName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detail Produk */}
            <div className="product-details p-4 flex flex-col">
              <p className="product-category text-sm mb-1">
                Category: {product.categoryId}
              </p>
              <p className="product-name text-lg font-semibold mb-2">
                {product.shoeName}
              </p>
              <p className="product-price text-xl font-bold mb-4">
                {product.shoePrice}
              </p>
              <div className="flex justify-between gap-4">
                <button className="cart-btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
                  Add to Cart
                </button>
                <button className="wishlist-btn text-red-500 hover:text-red-700 text-2xl">
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
