import React from 'react';
import './Sale.css'; 

function Sale() {
  // Data produk yang dapat dimodifikasi
  const products = [
    {
      id: 1,
      discount: "-40%",
      name: "NIKE Lorem Ipsum",
      price: "Rp. 1.019.400",
      originalPrice: "Rp. 1.699.000",
      image: "/images/nike-air.png", 
    },
    {
      id: 2,
      discount: "-50%",
      name: "NIke-Air Lorem Ipsum",
      price: "Rp. 1.349.500",
      originalPrice: "Rp. 2.699.000",
      image: "/images/sepatu2.png", 
    },
    {
      id: 3,
      discount: "-70%",
      name: "ADIDAS Lorem Ipsum",
      price: "Rp. 799.900",
      originalPrice: "Rp. 2.699.000",
      image: "/images/adidas_trail_run.png", 
    },
  ];

  return (
    <div className="sale-page">
      <h1 className="sale-title">10.10 SALE!</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="discount">{product.discount} OFF!</div>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <p className="product-category">Men Original</p>
              <p className="product-name">{product.name}</p>
              <p className="product-price">
                <span className="original-price">{product.originalPrice}</span> <br />
                {product.price}
              </p>
              <button className="cart-btn">+</button>
              <button className="wishlist-btn">❤</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sale;
