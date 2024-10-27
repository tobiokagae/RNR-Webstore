import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Categories() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const products = [
    { id: 1, name: 'NIKE-Air Lorem Ipsum', price: 1699000, image: '/images/sepatu2.png', category: 'Men Original' },
    { id: 2, name: 'ADIDAS Lorem Ipsum', price: 2699000, image: '/images/adidas_trail_run.png', category: 'Men Original' },
    { id: 3, name: 'NIKE Lorem Ipsum', price: 1899000, image: '/images/nike-air.png', category: 'Unisex Original' }
  ];

  const recommendations = [
    { id: 1, name: 'NIKE Lorem Ipsum', image: '/images/nike-air.png' },
    { id: 2, name: 'ADIDAS Lorem Ipsum', image: '/images/adidas_trail_run.png' },
    { id: 3, name: 'NIKE-Air Lorem Ipsum', image: '/images/sepatu2.png' }
  ];

  const handleSearchFocus = () => {
    setShowRecommendations(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowRecommendations(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-5">Best Product R&R</h2>
      <div className="relative flex justify-center items-center mb-8 w-full">
        <input
          type="text"
          placeholder="Cari di R&R"
          className="flex p-2 w-full max-w-lg rounded-lg border-none shadow-lg"
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        {showRecommendations && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white text-black w-full max-w-lg rounded-lg p-3 shadow-lg z-10">
            <p className="font-bold text-sm mb-2">Recommended for you</p>
            <ul className="list-none p-0">
              {recommendations.map(item => (
                <li key={item.id} className="flex items-center py-1">
                  <Link to={`/shoes/${item.id}`} className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-10 h-10 mr-2" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8 flex-wrap mb-8">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg p-4 text-center relative w-60 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <Link to={`/shoes/${product.id}`}>
              <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg mb-4" />
              <div className="mb-2">
                <span className="text-sm text-gray-400">{product.category}</span>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-md mt-1">{product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
              </div>
            </Link>
            <button className="absolute top-4 right-4 text-white text-lg hover:text-yellow-500"><i className="fas fa-heart"></i></button>
            <button className="absolute bottom-4 right-4 text-white text-xl hover:text-yellow-500"><i className="fas fa-plus"></i></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
