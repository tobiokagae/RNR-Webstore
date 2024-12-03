import React, { useState, useEffect } from "react";
import axios from "axios";

function Recomended() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Menambahkan state untuk halaman
  const itemsPerPage = 4; // Jumlah produk per halaman

  const id_user = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id_user) {
      setError("User not found");
      setLoading(false);
      return;
    }

    const startTraining = async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/train_recommendation",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Model training started successfully.");
      } catch (err) {
        console.error("Error starting model training:", err);
        setError("Failed to start model training.");
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shoe_recommendations/${id_user}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data || response.data.length === 0) {
          setError("No recommendations found");
          setLoading(false);
          return;
        }

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

    startTraining();
    fetchRecommendations();
  }, [id_user, token]);

  // Hitung produk yang akan ditampilkan berdasarkan halaman aktif
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const addToCart = async (shoeId, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          shoe_detail_id: shoeId,
          id_user: id_user,
          quantity: quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="recomended-page min-h-screen bg-[#1f2937] text-gray-900 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Recommended for You
      </h1>
      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card bg-gray-800 rounded-lg p-3 text-center shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" // Updated hover effect for consistency
            onClick={() => handleProductClick(product)}
          >
            <img
              src={`/images/${product.shoeName}.jpg`}
              alt={product.shoeName}
              className="w-full h-44 object-cover rounded-lg mb-3" // Mengurangi tinggi gambar
            />
            <div className="text-center">
              <span className="text-sm text-gray-400 block mb-2">
                {product.categoryId}
              </span>
              <h3 className="text-lg font-semibold text-white">
                {product.shoeName}
              </h3>
              <p className="text-sm text-green-400 mt-2">
                {product.shoePrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi Pagination */}
      <div className="pagination flex justify-center mt-8 space-x-2">
        {Array.from(
          { length: Math.ceil(products.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-blue-600 transition-colors`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-gray-800 p-6 rounded-lg max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-white">
              {selectedProduct.shoeName}
            </h3>
            <img
              src={`/images/${selectedProduct.shoeName}.jpg`}
              alt={selectedProduct.shoeName}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p className="text-white mb-2">
              <strong>Price:</strong>{" "}
              {selectedProduct.shoePrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
            <p className="text-white mb-2">
              <strong>Size:</strong> {selectedProduct.shoeSize}
            </p>
            <p className="text-white mb-4">
              <strong>Stock:</strong> {selectedProduct.stock}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                onClick={() => addToCart(selectedProduct.id, 1)}
              >
                Add to Cart
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recomended;
