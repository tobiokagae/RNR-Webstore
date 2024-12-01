import "./css/SignUpAdmin.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpAdmin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "Admin", // Menambahkan role Admin
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      alert(response.data.message);
      if (response.status === 200) {
        navigate("/signin"); // Mengarahkan ke halaman sign in setelah sign up berhasil
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <img src="/images/adidas_trail_run.png" alt="Shoes" />
        </div>
        <div className="signup-form">
          <h2>Sign Up Admin Now</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
            />
            <button type="submit" className="signup-button-1">
              Sign Up
            </button>
          </form>
          <p className="sign-in">
            Already have an account? <a href="/signin-admin">Log In</a>
          </p>
          <p className="terms">
            By signing up, I agree to the <a href="/">Terms & Conditions</a> and{" "}
            <a href="/">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpAdmin;
