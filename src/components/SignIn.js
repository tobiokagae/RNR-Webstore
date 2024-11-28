import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

function SignIn({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials
      );

      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const { username, role, access_token, user_id } = response.data;

      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);

      onLogin(username);
      role === "admin" ? navigate("/admin") : navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
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
              value={credentials.username}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="mb-1 font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            {/* Eye icon to toggle visibility */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-9 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
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
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
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
