import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/Product.css";

function Product({ userId }) {
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchShoes();
  }, []); // Fetch shoes only on initial load

  const token = localStorage.getItem("token");
  const id_user = localStorage.getItem("user_id");

  useEffect(() => {
    filterShoes(); // Filter shoes whenever category or shoes list changes
  }, [selectedCategory, shoes]);

  const fetchShoes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/shoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await axios.get(
        `http://localhost:5000/api/shoes/${shoeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedShoe(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching shoe details:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedShoe(null);
  };

  const addToCart = async (shoeId, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          shoe_detail_id: shoeId,
          id_user: id_user,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message); // Show success or error message
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold text-center text-black mb-6">
        All Product R&R
      </h2>
      <div className="mb-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {filteredShoes.map((shoe) => (
          <div
            key={shoe.shoe_detail_id}
            className="bg-gray-800 rounded-lg p-4 text-center relative group"
          >
            <Link
              to="#"
              onClick={() => handleShoeClick(shoe.shoe_detail_id)} // Open modal on click
            >
              <img
                src={`/images/${shoe.shoe_name}.jpg`}
                alt={shoe.shoe_name}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <div className="text-center">
                <span className="text-sm text-gray-400">
                  {getCategoryName(shoe.category_id)}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {shoe.shoe_name}
                </h3>
                <p className="text-md text-green-400 mt-2">
                  {shoe.shoe_price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
            </Link>
            <div className="absolute top-4 right-4">
              <button className="text-white text-lg hover:text-yellow-500">
                <i className="fas fa-heart"></i>
              </button>
            </div>
            <div className="absolute bottom-4 right-4">
              <button
                className="text-white text-xl hover:text-yellow-500"
                onClick={() => addToCart(shoe.shoe_detail_id, 1)} // Add to cart with quantity 1
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedShoe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-2xl font-bold mb-4">
              {selectedShoe.shoe_name}
            </h3>
            <img
              src={`/images/${selectedShoe.shoe_name}.jpg`}
              alt={selectedShoe.shoe_name}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <p>
              <strong>Price:</strong>{" "}
              {selectedShoe.shoe_price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </p>
            <p>
              <strong>Size:</strong> {selectedShoe.shoe_size}
            </p>
            <p>
              <strong>Stock:</strong> {selectedShoe.stock}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={() => addToCart(selectedShoe.shoe_detail_id, 1)} // Add to cart with quantity 1
              >
                Add to Cart
              </button>
              <button className="bg-yellow-500 text-white p-2 rounded">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;
