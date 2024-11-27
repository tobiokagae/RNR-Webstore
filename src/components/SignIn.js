import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignIn({ onLogin }) {
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
        onLogin(response.data.username);

        // Store user details, role, and JWT in localStorage
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);

        // Store JWT token
        if (response.data.token) {
          localStorage.setItem("token", response.data.token); // Save JWT token
        }

        // You can also store user ID if needed (assuming you have user_id in the response)
        if (response.data.user_id) {
          localStorage.setItem("user_id", response.data.user_id);
        }

        // Navigate based on the role
        if (response.data.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-radial from-gray-800 via-gray-700 to-black">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
          Welcome Back!
        </h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-600">
          Please sign in to continue
        </h2>

        <Link to="/signin-admin" className="block text-center mb-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 transform hover:scale-105">
            Go to Admin
          </button>
        </Link>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-1 font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Need Help?
            </Link>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
