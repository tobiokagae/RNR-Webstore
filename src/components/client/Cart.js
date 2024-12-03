import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [shoesDetails, setShoesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && token) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCartItems(data);
            const shoeIds = data.map((item) => item.shoe_detail_id);
            fetchShoesDetails(shoeIds);
          } else {
            setError("Invalid cart data");
          }
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoading(false));
    }
  }, [userId, token]);

  const fetchShoesDetails = (shoeIds) => {
    if (shoeIds.length > 0) {
      Promise.all(
        shoeIds.map((id) =>
          fetch(`http://127.0.0.1:5000/api/shoes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }).then((response) => response.json())
        )
      )
        .then((shoes) => setShoesDetails(shoes))
        .catch((error) => setError(error.message));
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      fetch(`http://127.0.0.1:5000/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          setCartItems(cartItems.filter((item) => item.id_cart !== id));
          setShowModal(false); // Close modal after deletion
        })
        .catch((error) => setError(error.message));
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set selected item to show in modal
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null); // Clear selected item
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCartItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold text-center text-black mb-6">
        My Cart
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
          {currentCartItems.map((item) => {
            const shoe = shoesDetails.find(
              (shoeDetail) => shoeDetail.shoe_detail_id === item.shoe_detail_id
            );
            return (
              <div
                key={item.id_cart}
                className="bg-gray-800 rounded-lg p-4 text-center relative group"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={`/images/${shoe?.shoe_name}.jpg`}
                  alt={shoe?.shoe_name}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
                <div className="text-center">
                  <span className="text-sm text-gray-400">
                    {shoe?.shoe_name} - {item.quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination flex justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-blue-600 transition-colors`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-2xl font-bold mb-4">
              {selectedItem?.shoe_name}
            </h3>
            <img
              src={`/images/${selectedItem?.shoe_name}.jpg`}
              alt={selectedItem?.shoe_name}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p>
              <strong>Quantity:</strong> {selectedItem.quantity}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {selectedItem.shoe_price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => handleDelete(selectedItem.id_cart)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
