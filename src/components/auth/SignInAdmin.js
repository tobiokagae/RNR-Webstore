import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./css/SignInAdmin.css";

function SignInAdmin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials
      );
      alert(response.data.message);
      if (response.status === 200) {
        if (response.data.role === "Admin") {
          onLogin(response.data.username);
          navigate("/admin"); // Mengarahkan ke halaman admin jika role adalah Admin
        } else {
          alert("Login failed: You do not have admin access.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="signin-admin-container">
      <h2 className="modal-title">Admin Sign In</h2>
      <form className="signin-admin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div className="actions">
          <p className="help-link">Need Help?</p>
          <button type="submit" className="submit-btn">
            Log In
          </button>
        </div>
      </form>
      <p className="sign-in">
        Do you have an account?<Link to="/signup-admin">Register</Link>
      </p>
    </div>
  );
}

export default SignInAdmin;
