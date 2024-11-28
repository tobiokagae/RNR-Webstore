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

import Categories from "./components/Categories";
import Recomended from "./components/Recomended";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ShoeDetail from "./components/ShoeDetail";
import Cart from "./components/Cart";
import Admin from "./components/Admin";
import Payment from "./components/Payment";
import SignUpAdmin from "./components/SignUpAdmin";
import Product from "./components/Product";
import AdminSepatu from "./components/AdminSepatu";
import AdminUser from "./components/AdminUser";
import AdminPayments from "./components/AdminPayments";
import AdminCarts from "./components/AdminCarts";
import AdminWishlists from "./components/AdminWishlists";
import AdminOrders from "./components/AdminOrders";
import AdminInteractions from "./components/AdminInteractions";
import AdminSepatuDetail from "./components/AdminSepatuDetail";
import SignInAdmin from "./components/SignInAdmin";

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    // Jika pengguna tidak login, arahkan ke halaman signin
    return <Navigate to="/signin" />;
  }
  return children;
};

// AdminRoute Component
const AdminRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (!user || role !== "Admin") {
    // Jika pengguna bukan admin, arahkan ke halaman home
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (username, userRole) => {
    setUser(username);
    setRole(userRole);
    localStorage.setItem("user", username);
    localStorage.setItem("role", userRole);
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
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/");
      }
    });
  };

  return (
    <div className="App bg-gray-100 min-h-screen">
      <header className="navbar flex items-center justify-between p-4 bg-blue-600 text-white">
        <div className="logo text-3xl font-bold">R&R</div>
        <nav className="menu flex space-x-4">
          <Link
            to={user ? "/" : "/signin"}
            className="menu-item text-xl hover:text-gray-300"
          >
            Home
          </Link>
          <Link
            to={user ? "/categories" : "/signin"}
            className="menu-item text-xl hover:text-gray-300"
          >
            Categories
          </Link>

          {/* Hanya tampilkan 'Recomended' jika bukan admin */}
          {role !== "Admin" && (
            <Link
              to={user ? "/recomended" : "/signin"}
              className="menu-item text-xl hover:text-gray-300"
            >
              Recomended
            </Link>
          )}

          <Link
            to={user ? "/products" : "/signin"}
            className="menu-item text-xl hover:text-gray-300"
          >
            Products
          </Link>

          {/* Hanya tampilkan 'Cart' jika bukan admin */}
          {role !== "Admin" && user && (
            <Link to="/cart" className="menu-item text-xl hover:text-gray-300">
              <img
                  src="/images/shopping-cart.png" // Ubah path ini ke lokasi gambar Anda
                  alt="Cart"
                  className="w-8 h-8" // Atur ukuran gambar sesuai kebutuhan
              />
            </Link>
          )}

          {/* Hanya tampilkan 'Dashboard' jika admin */}
          {role === "Admin" && (
            <Link to="/admin" className="menu-item text-xl hover:text-gray-300">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="auth-buttons flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                Welcome, <span className="font-semibold">{user}</span>
              </span>
              <button
                onClick={handleLogout}
                className="logout-button bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signin" className="signin-button">
                <button className="signin bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">
                  Sign in
                </button>
              </Link>
              <Link to="/signup" className="signup-button">
                <button className="signup bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main content for each route */}
      <Routes>
        <Route
          path="/"
          element={
            <section className="hero flex items-center justify-between p-8">
              <div className="text-container max-w-lg">
                <h1 className="title text-4xl font-bold text-blue-800 mb-4">
                  Roots & Routes
                </h1>
                <p className="description text-lg text-gray-600">
                  "Roots & Routes is an e-commerce platform that connects you
                  with a wide variety of quality fashion products, from shoes,
                  clothing, to the latest accessories. Discover style
                  inspiration from our exclusive collections and enjoy a
                  seamless, fast, and secure shopping experience. We believe
                  that every step you take is part of your journey, and we're
                  here to support it."
                </p>
              </div>
              <div className="image-container">
                <img
                  src="/images/logo_R&R2.jpg"
                  alt="Shoes"
                  className="w-96 h-auto"
                />
              </div>
            </section>
          }
        />

        {/* Public Routes */}
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/recomended"
          element={
            role !== "Admin" ? (
              <PrivateRoute>
                <Recomended />
              </PrivateRoute>
            ) : (
              <Navigate to="/" /> // Redirect ke halaman utama jika admin
            )
          }
        />
        <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            role !== "Admin" ? (
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            ) : (
              <Navigate to="/" /> // Redirect ke halaman utama jika admin
            )
          }
        />
        <Route
          path="/payment/:id"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminSepatu />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/shoes"
          element={
            <AdminRoute>
              <AdminSepatuDetail />
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
          path="/admin/carts"
          element={
            <AdminRoute>
              <AdminCarts />
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
        <Route
          path="/signin-admin"
          element={<SignInAdmin onLogin={handleLogin} />}
        />
      </Routes>
    </div>
  );
}

export default App;
