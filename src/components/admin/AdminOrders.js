import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user_id: localStorage.getItem("user_id"), // Ambil user_id dari localStorage
    shoe_detail_id: "",
    order_status: "",
    order_date: "",
    amount: "",
  });
  const [editOrder, setEditOrder] = useState(null);

  // Set Axios header untuk semua permintaan
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const handleCreateOrder = () => {
    axios
      .post("http://localhost:5000/api/orders", newOrder)
      .then(() => {
        fetchOrders();
        setNewOrder({
          user_id: localStorage.getItem("user_id"),
          shoe_detail_id: "",
          order_status: "",
          order_date: "",
          amount: "",
        });
        Swal.fire("Success!", "Order created successfully!", "success");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
        Swal.fire("Error!", "Failed to create order.", "error");
      });
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
  };

  const handleUpdateOrder = () => {
    axios
      .put(`http://localhost:5000/api/orders/${editOrder.order_id}`, {
        order_status: editOrder.order_status,
        order_date: editOrder.order_date,
      })
      .then(() => {
        fetchOrders();
        setEditOrder(null);
        Swal.fire("Success!", "Order updated successfully!", "success");
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        Swal.fire("Error!", "Failed to update order.", "error");
      });
  };

  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/orders/${orderId}`)
          .then(() => {
            fetchOrders();
            Swal.fire("Deleted!", "Order has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting order:", error);
            Swal.fire("Error!", "Failed to delete order.", "error");
          });
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-10">Daftar Pesanan</h1>

      <table className="min-w-full bg-gray-800 text-white mt-5 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Shoe Detail ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.order_id}
              className="text-center border-b border-gray-700 hover:bg-gray-700"
            >
              <td className="px-4 py-2">{order.order_id}</td>
              <td className="px-4 py-2">{order.user_id}</td>
              <td className="px-4 py-2">{order.shoe_detail_id}</td>
              <td className="px-4 py-2">
                {editOrder && editOrder.order_id === order.order_id ? (
                  <input
                    type="text"
                    value={editOrder.order_status}
                    onChange={(e) =>
                      setEditOrder({
                        ...editOrder,
                        order_status: e.target.value,
                      })
                    }
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  order.order_status
                )}
              </td>
              <td className="px-4 py-2">
                {editOrder && editOrder.order_id === order.order_id ? (
                  <input
                    type="date"
                    value={editOrder.order_date}
                    onChange={(e) =>
                      setEditOrder({ ...editOrder, order_date: e.target.value })
                    }
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  new Date(order.order_date).toLocaleDateString()
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editOrder && editOrder.order_id === order.order_id ? (
                  <button
                    onClick={handleUpdateOrder}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditOrder(order)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteOrder(order.order_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
