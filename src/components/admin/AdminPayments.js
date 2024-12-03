import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    order_id: "",
    payment_method: "",
    payment_status: "",
    payment_date: "",
  });
  const [editPayment, setEditPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleCreatePayment = async () => {
    if (
      !newPayment.order_id ||
      !newPayment.payment_method ||
      !newPayment.payment_status ||
      !newPayment.payment_date
    ) {
      Swal.fire("Error!", "All fields are required!", "error");
      return;
    }

    const paymentData = { ...newPayment };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/payments",
        paymentData
      );
      fetchPayments();
      setNewPayment({
        order_id: "",
        payment_method: "",
        payment_status: "",
        payment_date: "",
      });
      Swal.fire("Success!", response.data.message, "success"); // Tampilkan pesan dari backend
    } catch (error) {
      console.error("Error processing payment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to process payment."; // Ambil pesan kesalahan dari backend
      Swal.fire("Error!", errorMessage, "error"); // Tampilkan pesan kesalahan
    }
  };

  const handleEditPayment = (payment) => {
    setEditPayment({ ...payment });
  };

  const handleUpdatePayment = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/payments/${editPayment.payment_id}`,
        editPayment
      );
      fetchPayments();
      setEditPayment(null);
      Swal.fire("Success!", response.data.message, "success"); // Tampilkan pesan dari backend
    } catch (error) {
      console.error("Error updating payment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update payment status."; // Ambil pesan kesalahan dari backend
      Swal.fire("Error!", errorMessage, "error"); // Tampilkan pesan kesalahan
    }
  };

  const handleDeletePayment = async (paymentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/payments/${paymentId}`
        );
        fetchPayments();
        Swal.fire("Deleted!", response.data.message, "success"); // Tampilkan pesan dari backend
      } catch (error) {
        console.error("Error deleting payment:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to delete payment."; // Ambil pesan kesalahan dari backend
        Swal.fire("Error!", errorMessage, "error"); // Tampilkan pesan kesalahan
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Pembayaran</h1>
      {/* <div className="flex space-x-3 mb-6">
        <input
          type="number"
          placeholder="ID Order"
          value={newPayment.order_id}
          onChange={(e) =>
            setNewPayment({ ...newPayment, order_id: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Metode Pembayaran"
          value={newPayment.payment_method}
          onChange={(e) =>
            setNewPayment({ ...newPayment, payment_method: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Status Pembayaran"
          value={newPayment.payment_status}
          onChange={(e) =>
            setNewPayment({ ...newPayment, payment_status: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="date"
          placeholder="Tanggal Pembayaran"
          value={newPayment.payment_date}
          onChange={(e) =>
            setNewPayment({ ...newPayment, payment_date: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <button
          onClick={handleCreatePayment}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Proses Pembayaran
        </button>
      </div> */}
      <table className="table-auto w-full mt-5 bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">ID Pembayaran</th>
            <th className="px-4 py-2">ID Order</th>
            <th className="px-4 py-2">Metode Pembayaran</th>
            <th className="px-4 py-2">Status Pembayaran</th>
            <th className="px-4 py-2">Tanggal Pembayaran</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.payment_id}
              className="text-center border-b border-gray-700"
            >
              <td className="px-4 py-2">{payment.payment_id}</td>
              <td className="px-4 py-2">{payment.order_id}</td>
              <td className="px-4 py-2">
                {editPayment &&
                editPayment.payment_id === payment.payment_id ? (
                  <input
                    type="text"
                    value={editPayment.payment_method}
                    onChange={(e) =>
                      setEditPayment({
                        ...editPayment,
                        payment_method: e.target.value,
                      })
                    }
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  payment.payment_method
                )}
              </td>
              <td className="px-4 py-2">
                {editPayment &&
                editPayment.payment_id === payment.payment_id ? (
                  <input
                    type="text"
                    value={editPayment.payment_status}
                    onChange={(e) =>
                      setEditPayment({
                        ...editPayment,
                        payment_status: e.target.value,
                      })
                    }
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  payment.payment_status
                )}
              </td>
              <td className="px-4 py-2">
                {editPayment &&
                editPayment.payment_id === payment.payment_id ? (
                  <input
                    type="date"
                    value={editPayment.payment_date}
                    onChange={(e) =>
                      setEditPayment({
                        ...editPayment,
                        payment_date: e.target.value,
                      })
                    }
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  new Date(payment.payment_date).toLocaleDateString()
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editPayment &&
                editPayment.payment_id === payment.payment_id ? (
                  <button
                    onClick={handleUpdatePayment}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditPayment(payment)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeletePayment(payment.payment_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPayments;
