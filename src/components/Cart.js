import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [shoesDetails, setShoesDetails] = useState([]);
  const navigate = useNavigate();

  // Ambil user_id dari localStorage
  const userId = localStorage.getItem("user_id");

  // Fetch cart data from backend
  useEffect(() => {
    if (userId) {
      fetch(`/api/cart/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCartItems(data);
            // Ambil detail sepatu untuk semua item yang ada di keranjang
            const shoeIds = data.map((item) => item.shoe_detail_id);
            fetchShoesDetails(shoeIds);
          }
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    }
  }, [userId]);

  // Ambil detail sepatu berdasarkan shoe_detail_ids
  const fetchShoesDetails = (shoeIds) => {
    Promise.all(
      shoeIds.map((id) =>
        fetch(`/api/shoes/${id}`).then((response) => response.json())
      )
    )
      .then((shoes) => {
        setShoesDetails(shoes);
      })
      .catch((error) => console.error("Error fetching shoes details:", error));
  };

  // Function to handle deleting an item from the cart
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const updatedCart = cartItems.filter((item) => item.id_cart !== id);
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Call API to delete the item from the backend
      fetch(`/api/cart/${id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
          console.log("Item removed from cart:", data);
        })
        .catch((error) =>
          console.error("Error removing item from cart:", error)
        );
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
          {cartItems.map((item) => {
            const shoeDetail = shoesDetails.find(
              (shoe) => shoe.shoe_detail_id === item.shoe_detail_id
            );
            return shoeDetail ? (
              <div key={item.id_cart} className="cart-item">
                <img
                  src={shoeDetail.image}
                  alt={shoeDetail.shoe_name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{shoeDetail.shoe_name}</h3>
                  <p>
                    Price:{" "}
                    {shoeDetail.shoe_price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Date Added: {new Date(item.date_added).toLocaleDateString()}
                  </p>
                </div>
                <div className="cart-item-actions">
                  <button
                    className="buy-btn"
                    onClick={() => handleBuy(item.id_cart)}
                  >
                    Buy
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id_cart)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
