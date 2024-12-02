import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Swal from "sweetalert2"; // Import SweetAlert2

import Recomended from "./components/client/Recomended";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ShoeDetail from "./components/client/ShoeDetail";
import Cart from "./components/client/Cart";
import Payment from "./components/client/Payment";
import Product from "./components/client/Product";
import AdminSepatu from "./components/admin/AdminSepatu";
import AdminUser from "./components/admin/AdminUser";
import AdminPayments from "./components/admin/AdminPayments";
import AdminWishlists from "./components/admin/AdminWishlists";
import AdminOrders from "./components/admin/AdminOrders";
import AdminInteractions from "./components/admin/AdminInteractions";
import OrderPage from "./components/client/OrderPage";
import ProfilePage from "./components/client/ProfilePage";

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }
  return children;
};

// AdminRoute Component
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role == "User") {
    return <Navigate to="/" />;
  }
  return children;
};

// Home Component
const Home = () => {
  return (
    <section className="hero flex items-center justify-between p-8">
      <div className="text-container max-w-lg">
        <h1 className="title text-4xl font-bold text-blue-800 mb-4">
          Roots & Routes
        </h1>
        <p className="description text-lg text-gray-600">
          "Roots & Routes is an e-commerce platform that connects you with a
          wide variety of quality fashion products, from shoes, clothing, to the
          latest accessories. Discover style inspiration from our exclusive
          collections and enjoy a seamless, fast, and secure shopping
          experience."
        </p>
      </div>
      <div className="image-container">
        <img src="/images/cart_ring.png" alt="Shoes" className="w-96 h-auto" />
      </div>
    </section>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (username, userRole) => {
    setUser(username);
    setRole(userRole);
    localStorage.setItem("username", username);
    localStorage.setItem("role", userRole);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "No, stay logged in",
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null);
        setRole(null);
        localStorage.clear(); // Clear all localStorage items
        navigate("/");
      }
    });
  };

  return (
    <div className="App bg-gray-100 min-h-screen">
      <header className="navbar flex items-center justify-between p-4 bg-blue-600 text-white">
        <div className="logo text-3xl font-bold">R&R</div>
        <nav className="menu flex space-x-4">
          {/* Home link */}
          <Link
            to={user ? "/" : "/signin"}
            className="menu-item text-xl hover:text-gray-300"
          >
            Home
          </Link>

          {/* Conditional rendering based on role */}
          {role === "User" && (
            <>
              <Link
                to={user ? "/recomended" : "/signin"}
                className="menu-item text-xl hover:text-gray-300"
              >
                Recomended
              </Link>
              <Link
                to={user ? "/products" : "/signin"}
                className="menu-item text-xl hover:text-gray-300"
              >
                Products
              </Link>

              <Link
                to={user ? "/orders" : "/signin"}
                className="menu-item text-xl hover:text-gray-300"
              >
                Order
              </Link>

              <Link
                to="/cart"
                className="menu-item text-xl hover:text-gray-300"
              >
                <img
                  src="/images/shopping-cart.png"
                  alt="Cart"
                  className="w-8 h-8"
                />
              </Link>
            </>
          )}

          {role === "Admin" && (
            <>
              <Link
                to="/admin/categories"
                className="menu-item text-xl hover:text-gray-300"
              >
                Categories
              </Link>
              <Link
                to="/admin/users"
                className="menu-item text-xl hover:text-gray-300"
              >
                Users
              </Link>
              <Link
                to="/admin/payments"
                className="menu-item text-xl hover:text-gray-300"
              >
                Payments
              </Link>
              <Link
                to="/admin/wishlists"
                className="menu-item text-xl hover:text-gray-300"
              >
                Wishlists
              </Link>
              <Link
                to="/admin/orders"
                className="menu-item text-xl hover:text-gray-300"
              >
                Orders
              </Link>
              <Link
                to="/admin/interactions"
                className="menu-item text-xl hover:text-gray-300"
              >
                Interactions
              </Link>
            </>
          )}
        </nav>

        <div className="auth-buttons flex items-center space-x-4">
          {user ? (
            <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-1 text-lg text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <span>Welcome, {user}</span>
              <svg
                className={`w-4 h-4 transition-transform transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
      
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md overflow-hidden z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          ) : (
            <>
              <Link to="/signin">
                <button className="signin bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className="signup bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main content for each route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/recomended"
          element={
            <PrivateRoute>
              <Recomended />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute></AdminRoute>} />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminSepatu />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/wishlists"
          element={
            <AdminRoute>
              <AdminWishlists />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/interactions"
          element={
            <AdminRoute>
              <AdminInteractions />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
