import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminCarts() {
  const [carts, setCarts] = useState([]);
  const [newCart, setNewCart] = useState({
    id_user: '',
    shoe_detail_id: '',
    quantity: ''
  });
  const [editCart, setEditCart] = useState(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = () => {
    axios.get('http://localhost:5000/api/cart')
      .then(response => {
        setCarts(response.data);
      })
      .catch(error => {
        console.error('Error fetching carts:', error);
      });
  };

  const handleCreateCart = () => {
    axios.post('http://localhost:5000/api/cart', newCart)
      .then(() => {
        fetchCarts();
        setNewCart({ id_user: '', shoe_detail_id: '', quantity: '' });
        Swal.fire('Success!', 'Cart created successfully!', 'success');
      })
      .catch(error => {
        console.error('Error creating cart:', error);
        Swal.fire('Error!', 'Failed to create cart.', 'error');
      });
  };

  const handleEditCart = (cart) => {
    setEditCart(cart);
  };

  const handleUpdateCart = () => {
    axios.put(`http://localhost:5000/api/cart/${editCart.id_cart}`, editCart)
      .then(() => {
        fetchCarts();
        setEditCart(null);
        Swal.fire('Success!', 'Cart updated successfully!', 'success');
      })
      .catch(error => {
        console.error('Error updating cart:', error);
        Swal.fire('Error!', 'Failed to update cart.', 'error');
      });
  };

  const handleDeleteCart = (cartId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/cart/${cartId}`)
          .then(() => {
            fetchCarts();
            Swal.fire('Deleted!', 'Cart has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting cart:', error);
            Swal.fire('Error!', 'Failed to delete cart.', 'error');
          });
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Keranjang</h1>
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="User ID"
          value={newCart.id_user}
          onChange={(e) => setNewCart({ ...newCart, id_user: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Shoe ID"
          value={newCart.shoe_detail_id}
          onChange={(e) => setNewCart({ ...newCart, shoe_detail_id: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newCart.quantity}
          onChange={(e) => setNewCart({ ...newCart, quantity: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <button 
          onClick={handleCreateCart}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Cart
        </button>
      </div>
      <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-2">Cart ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Shoe ID</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {carts.map(cart => (
            <tr key={cart.id_cart} className="text-center border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{cart.id_cart}</td>
              <td className="px-4 py-2">
                {editCart && editCart.id_cart === cart.id_cart ? (
                  <input
                    type="text"
                    value={editCart.id_user}
                    onChange={(e) => setEditCart({ ...editCart, id_user: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  cart.id_user
                )}
              </td>
              <td className="px-4 py-2">
                {editCart && editCart.id_cart === cart.id_cart ? (
                  <input
                    type="text"
                    value={editCart.shoe_detail_id}
                    onChange={(e) => setEditCart({ ...editCart, shoe_detail_id: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  cart.shoe_detail_id
                )}
              </td>
              <td className="px-4 py-2">
                {editCart && editCart.id_cart === cart.id_cart ? (
                  <input
                    type="number"
                    value={editCart.quantity}
                    onChange={(e) => setEditCart({ ...editCart, quantity: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  cart.quantity
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editCart && editCart.id_cart === cart.id_cart ? (
                  <button 
                    onClick={handleUpdateCart}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditCart(cart)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteCart(cart.id_cart)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
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

export default AdminCarts;
