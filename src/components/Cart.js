import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Fetch cart data from localStorage on component mount
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cartData);
  }, []);

  // Function to handle deleting an item from the cart
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  // Function to handle buying an item (redirect to payment page)
  const handleBuy = (id) => {
    navigate(`/payment/${id}`);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Date Added: {new Date(item.date_added).toLocaleDateString()}</p>
              </div>
              <div className="cart-item-actions">
                <button 
                  className="buy-btn" 
                  onClick={() => handleBuy(item.id)}
                >
                  Buy
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
