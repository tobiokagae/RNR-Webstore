import React from 'react';
import './Admin.css';

function Admin() {
  return (
    <div className="admin-dashboard bg-black min-h-screen flex flex-col">
      <div className="admin-content text-white p-6">
        <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
        <p className="mt-2">Select an option from the navbar to manage the application.</p>
      </div>
      <nav className="admin-navbar bg-gray-800">
        <ul className="flex space-x-4 p-4">
          <li><a href="/admin/shoes" className="text-white hover:text-yellow-500">Manage Shoes</a></li>
          <li><a href="/admin/categories" className="text-white hover:text-yellow-500">Manage Categories</a></li>
          <li><a href="/admin/users" className="text-white hover:text-yellow-500">Manage Users</a></li>
          <li><a href="/admin/orders" className="text-white hover:text-yellow-500">Manage Orders</a></li>
          <li><a href="/admin/payments" className="text-white hover:text-yellow-500">Manage Payments</a></li>
          <li><a href="/admin/carts" className="text-white hover:text-yellow-500">Manage Carts</a></li>
          <li><a href="/admin/wishlists" className="text-white hover:text-yellow-500">Manage Wishlists</a></li>
          <li><a href="/admin/interactions" className="text-white hover:text-yellow-500">Manage User Interactions</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Admin;
