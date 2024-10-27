import React from 'react';
import './Admin.css';

function Admin() {
  return (
    <div className="admin-dashboard">
          <div className="admin-content">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Select an option from the navbar to manage the application.</p>
      </div>
      <nav className="admin-navbar">
        <ul>
          <li><a href="/admin/shoes">Sepatu</a></li>
          <li><a href="/admin/categories">Kategori</a></li>
          <li><a href="/admin/users">Manage Users</a></li>
          <li><a href="/admin/orders">Manage Orders</a></li>
          <li><a href="/admin/products">Manage Products</a></li>
  
        </ul>
      </nav>
    
    </div>
  );
}

export default Admin;
