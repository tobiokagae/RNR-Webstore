import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/OrderPage.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    shoe_detail_id: '',
    order_status: '',
    order_date: '',
    amount: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders');
    }
  };

  // Handle form submission to create a new order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/orders', newOrder);
      setSuccessMessage(response.data.message);
      fetchOrders();
      setNewOrder({
        user_id: '',
        shoe_detail_id: '',
        order_status: '',
        order_date: '',
        amount: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order');
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`/api/orders/${orderId}`);
      setSuccessMessage(response.data.message);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <div className="order-page">
      <h1>Orders</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <div className="order-form">
        <h3>Create Order</h3>
        <form onSubmit={handleCreateOrder}>
          <input
            type="text"
            placeholder="User ID"
            value={newOrder.user_id}
            onChange={(e) => setNewOrder({ ...newOrder, user_id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Shoe Detail ID"
            value={newOrder.shoe_detail_id}
            onChange={(e) => setNewOrder({ ...newOrder, shoe_detail_id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Order Status"
            value={newOrder.order_status}
            onChange={(e) => setNewOrder({ ...newOrder, order_status: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Order Date"
            value={newOrder.order_date}
            onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Amount"
            value={newOrder.amount}
            onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
            required
          />
          <button type="submit">Create Order</button>
        </form>
      </div>

      <div className="order-list">
        <h2>Order List</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Shoe Detail ID</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_id}</td>
                <td>{order.shoe_detail_id}</td>
                <td>{order.order_status}</td>
                <td>{order.order_date}</td>
                <td>{order.amount}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(order.order_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPage;
