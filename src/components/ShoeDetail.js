import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShoeDetail.css';

function ShoeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shoes/${id}`);
        setShoe(response.data);
      } catch (error) {
        console.error("Error fetching shoe details:", error);
      }
    };

    fetchShoe();
  }, [id]);

  const getCategoryName = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "Sport";
      case 2:
        return "Casual";
      case 3:
        return "Boots";
      case 4:
        return "Heels";
      case 5:
        return "Formal";
      default:
        return "Unknown";
    }
  };

  if (!shoe) {
    return <h2>Loading...</h2>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === shoe.id);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        ...shoe,
        quantity: 1,
        date_added: new Date().toISOString(),
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${shoe.shoe_name} added to cart!`);
  };

  const handleBuyNow = () => {
    navigate(`/payment/${shoe.id}`);
  };

  return (
    <div className="shoe-detail-container">
      <div className="shoe-detail-content">
        <div className="shoe-image-section">
          <img src={`/images/${shoe.shoe_name}.jpg`} alt={shoe.shoe_name} className="shoe-image" />
        </div>

        <div className="shoe-info-section">
          <p className="shoe-category">{getCategoryName(shoe.category_id)}</p>
          <h1 className="shoe-name">{shoe.shoe_name}</h1>
          <p className="shoe-price">{shoe.shoe_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          <p className="shoe-size">Size: {shoe.shoe_size}</p>
          <p className="stock-status">In Stock, {shoe.stock}</p>

          <button className="add-to-cart-button" onClick={addToCart}>ADD TO CART</button>
          <button className="buy-button" onClick={handleBuyNow}>BUY</button>
        </div>
      </div>
    </div>
  );
}

export default ShoeDetail;