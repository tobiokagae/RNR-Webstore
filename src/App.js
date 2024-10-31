import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Categories from "./components/Categories";
import Sale from "./components/Sale";
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
import AdminGallery from "./components/AdminGallery";
import AdminCarts from "./components/AdminCarts";
import AdminWishlists from "./components/AdminWishlists";
import AdminOrders from "./components/AdminOrders";
import AdminInteractions from "./components/AdminInteractions";
import AdminSepatuDetail from "./components/AdminSepatuDetail";

import SignInAdmin from "./components/SignInAdmin";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // State for user role

  const handleLogin = (username, userRole) => {
    setUser(username);
    setRole(userRole); // Store user role
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null); // Clear user role
  };

  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <div className="logo">R&R</div>
          <nav className="menu">
            <Link to={user ? "/" : "/signin"} className="menu-item">
              Home
            </Link>
            <Link to={user ? "/categories" : "/signin"} className="menu-item">
              Categories
            </Link>
            <Link to={user ? "/sale" : "/signin"} className="menu-item">
              Sale
            </Link>
            <Link to={user ? "/products" : "/signin"} className="menu-item">
              Products
            </Link>
            <Link to={user ? "/cart" : "/signin"} className="menu-item">
              <img src="/images/cart.png" alt="Cart" className="cart-logo" />
            </Link>
          </nav>
          <div className="auth-buttons">
            {user ? (
              <div>
                <span>Welcome, {user}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/signin" className="signin-button">
                  <button className="signin">Sign in</button>
                </Link>
                <Link to="/signup" className="signup-button">
                  <button className="signup">Sign Up</button>
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
              <section className="hero">
                <div className="text-container">
                  <h1 className="title">Roots & Routes</h1>
                  <p className="description">
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
                  <img src="/images/sneakers_nike.png" alt="Shoes" />
                </div>
              </section>
            }
          />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products" element={<Product />} />
          <Route path="/signup-admin" element={<SignUpAdmin />} />
          <Route path="/admin/categories" element={<AdminSepatu />} />
          <Route path="/admin/shoes" element={<AdminSepatuDetail />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/carts" element={<AdminCarts />} />
          <Route path="/admin/wishlists" element={<AdminWishlists />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/interactions" element={<AdminInteractions />} />
          <Route path="/shoes/:id" element={<ShoeDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route
            path="/signin-admin"
            element={<SignInAdmin onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
