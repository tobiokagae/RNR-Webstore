import React, { useState, useEffect } from "react";
import axios from "axios";

function Order() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Sesuaikan dengan jumlah items per halaman yang diinginkan

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id"); // Ambil user_id dari localStorage

  useEffect(() => {
    if (userId && token) {
      fetchOrders();
    } else {
      console.error("User ID atau Token tidak ditemukan.");
    }
  }, []); // Ambil data order saat pertama kali halaman dimuat

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}`, // Ganti dengan endpoint yang sesuai
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Logika pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Menghitung total halaman
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination range: Menampilkan beberapa halaman sekitar currentPage
  const getPaginationRange = () => {
    const range = 3; // Jumlah halaman yang ditampilkan di sekitar halaman saat ini
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    let pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Menambahkan "..." di awal atau akhir jika perlu
    if (start > 1) pages = [1, "..."].concat(pages);
    if (end < totalPages) pages.push("...");

    return pages;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        Your Orders
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {currentOrders.map((order) => (
          <div
            key={order.order_id}
            className="bg-gray-800 rounded-lg p-4 text-center relative group transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            {/* Menampilkan gambar sepatu */}
            <img
              src={`/images/${order.shoe_name}.jpg`} // Menggunakan shoe_name untuk menentukan nama gambar
              alt={order.shoe_name}
              className="w-full h-44 object-cover rounded-lg mb-3 transform transition duration-300 ease-in-out group-hover:scale-110 group-hover:border-2 group-hover:border-yellow-500"
            />

            {/* Menampilkan Nama Sepatu di atas */}
            <h3 className="text-xl font-bold text-white mb-2">
              Shoe: {order.shoe_name}
            </h3>

            <div className="text-center">
              <p className="text-md text-gray-400 mt-2">
                Status: {order.order_status}
              </p>
              <p className="text-md text-gray-400 mt-2">
                Order Date: {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="text-md text-green-400 mt-2">
                Amount: {order.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination flex justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>

        {getPaginationRange().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            } hover:bg-blue-600 transition-colors`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Order;
