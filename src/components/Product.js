import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Product.css";

function Product({ userId }) {
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchShoes();
  }, []);

  useEffect(() => {
    filterShoes();
  }, [selectedCategory, shoes]);

  const fetchShoes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/shoes");
      const shuffledShoes = shuffleArray(response.data);
      setShoes(shuffledShoes);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

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

  const filterShoes = () => {
    if (selectedCategory === "All") {
      setFilteredShoes(shoes);
    } else {
      const categoryMap = {
        Sport: 1,
        Casual: 2,
        Boots: 3,
        Heels: 4,
        Formal: 5,
      };
      const categoryId = categoryMap[selectedCategory];
      setFilteredShoes(shoes.filter((shoe) => shoe.category_id === categoryId));
    }
  };

  const handleShoeClick = async (shoeId) => {
    try {
      await axios.post("http://localhost:5000/api/user_interactions", {
        user_id: userId,
        shoe_detail_id: shoeId,
        interaction_type: "view",
      });
    } catch (error) {
      console.error("Error logging interaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-900 to-gray-800 text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-black mb-5">Best Product R&R</h2>
      <div className="mb-5">
        <span className="text-lg text-black">Filtered Shoes by: </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          <option value="All">All</option>
          <option value="Sport">Sport</option>
          <option value="Casual">Casual</option>
          <option value="Boots">Boots</option>
          <option value="Heels">Heels</option>
          <option value="Formal">Formal</option>
        </select>
      </div>
      <div className="flex justify-center gap-8 flex-wrap mb-8">
        {filteredShoes.map((shoe) => (
          <div
            key={shoe.shoe_detail_id}
            className="bg-gray-800 rounded-lg p-4 text-center relative w-60 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link
              to={`/shoes/${shoe.shoe_detail_id}`}
              onClick={() => handleShoeClick(shoe.shoe_detail_id)}
            >
              <img
                src={`/images/${shoe.shoe_name}.jpg`}
                alt={shoe.shoe_name}
                className="w-full h-auto rounded-lg mb-4"
              />
              <div className="mb-2">
                <span className="text-sm text-gray-400">
                  {getCategoryName(shoe.category_id)}
                </span>
                <h3 className="text-lg font-bold">{shoe.shoe_name}</h3>
                <p className="text-md mt-1">
                  {shoe.shoe_price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
            </Link>
            <button className="absolute top-4 right-4 text-white text-lg hover:text-yellow-500">
              <i className="fas fa-heart"></i>
            </button>
            <button className="absolute bottom-4 right-4 text-white text-xl hover:text-yellow-500">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
