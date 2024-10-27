import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ShoeDetail.css';

const products = [
  { id: 1, name: 'NIKE-Air Lorem Ipsum', price: 1699000, image: '/images/sepatu2.png', category: 'Men Original', color: 'Black/Green/White' },
  { id: 2, name: 'ADIDAS Lorem Ipsum', price: 2699000, image: '/images/adidas_trail_run.png', category: 'Men Original', color: 'Gray/White' },
  { id: 3, name: 'NIKE Lorem Ipsum', price: 1899000, image: '/images/nike-air.png', category: 'Unisex Original', color: 'Black/White' }
];

function ShoeDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // To navigate to the payment page
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        date_added: new Date().toISOString(),
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    navigate(`/payment/${product.id}`);
  };

  return (
    <div className="shoe-detail-container">
      <div className="shoe-detail-content">
        <div className="shoe-image-section">
          <img src={product.image} alt={product.name} className="shoe-image" />
        </div>

        <div className="shoe-info-section">
          <p className="shoe-category">{product.category}</p>
          <h1 className="shoe-name">{product.name}</h1>
          <p className="shoe-color">{product.color}</p>
          <p className="shoe-price">{product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>

          <div className="size-selection">
            <label htmlFor="size-select">Select Size:</label>
            <select id="size-select" className="size-dropdown">
              <option value="uk">UK</option>
              <option value="us">US</option>
              <option value="eu">EU</option>
            </select>
            <select id="shoe-size" className="shoe-size-dropdown">
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <p className="stock-status">In Stock</p>

          <button className="add-to-cart-button" onClick={addToCart}>ADD TO CART</button>
          <button className="buy-button" onClick={handleBuyNow}>BUY</button> {/* New Buy button */}
        </div>
      </div>
    </div>
  );
}

export default ShoeDetail;
