import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ShoeDetail.css";

function ShoeDetail() {
  const { id } = useParams(); // Ambil ID dari URL parameter
  const navigate = useNavigate();
  const [shoe, setShoe] = useState(null); // State untuk menyimpan data sepatu
  const [error, setError] = useState(null); // State untuk menangani error

  // Ambil token dari localStorage
  const token = localStorage.getItem("token"); // Pastikan token disimpan dengan nama "token"

  // Fetch data sepatu ketika komponen pertama kali dimuat
  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shoes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sisipkan token di sini
            },
          }
        );
        setShoe(response.data);
      } catch (error) {
        console.error("Error fetching shoe details:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchShoe();
  }, [id, token]);

  // Menambahkan sepatu ke keranjang dengan API
  const addToCart = async () => {
    try {
      const userId = 1; // Ganti ini dengan ID user dari sistem autentikasi Anda
      const data = {
        id_user: userId,
        shoe_detail_id: shoe.shoe_detail_id,
        quantity: 1, // Default quantity
      };

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sisipkan token di sini
          },
        }
      );

      if (response.status === 201) {
        alert(`${shoe.shoe_name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(
        "There was an issue adding the item to your cart. Please try again."
      );
    }
  };

  // Fungsi untuk mengarahkan ke halaman pembayaran
  const handleBuyNow = () => {
    navigate(`/payment/${shoe.shoe_detail_id}`);
  };

  // Tampilkan error jika terjadi kesalahan
  if (error) {
    return <h2>{error}</h2>;
  }

  // Tampilkan loading jika data masih kosong
  if (!shoe) {
    return <h2>Loading...</h2>;
  }

  // Menampilkan detail sepatu
  return (
    <div className="shoe-detail-container">
      <div className="shoe-detail-content">
        <div className="shoe-image-section">
          <img
            src={`/images/${shoe.shoe_name
              .replace(/\s+/g, "_")
              .toLowerCase()}.jpg`}
            alt={shoe.shoe_name}
            className="shoe-image"
          />
        </div>

        <div className="shoe-info-section">
          <p className="shoe-category">{getCategoryName(shoe.category_id)}</p>
          <h1 className="shoe-name">{shoe.shoe_name}</h1>
          <p className="shoe-price">
            {shoe.shoe_price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>
          <p className="shoe-size">Size: {shoe.shoe_size}</p>
          <p className="stock-status">In Stock: {shoe.stock}</p>

          <button className="add-to-cart-button" onClick={addToCart}>
            ADD TO CART
          </button>
          <button className="buy-button" onClick={handleBuyNow}>
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

// Fungsi untuk menentukan nama kategori sepatu berdasarkan ID
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

export default ShoeDetail;
