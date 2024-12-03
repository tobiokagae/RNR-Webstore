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

      // Simpan informasi user, termasuk role di localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("role", role); // Menyimpan role (admin/user)
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("isLoggedIn", true);

      onLogin(username, role);

      // Navigasi berdasarkan role
      if (role === "admin") {
        navigate("/admin"); // Arahkan ke halaman admin jika role admin
      } else {
        navigate("/"); // Arahkan ke halaman utama jika role bukan admin
      }
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
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-800">
          Welcome Back!
        </h1>
        <h2 className="text-xl font-semibold mb-8 text-center text-gray-600">
          Please sign in to continue
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="mb-2 font-semibold text-gray-700"
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
              className="border border-gray-300 p-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="mb-2 font-semibold text-gray-700"
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
              className="border border-gray-300 p-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm pr-12"
            />
            {/* Eye icon to toggle visibility */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Need Help?
            </Link>
            <button
              type="submit"
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-700">
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
