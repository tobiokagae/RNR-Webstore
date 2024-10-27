import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

function SignIn({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', credentials);
      alert(response.data.message);
      if (response.status === 200) {
        onLogin(response.data.username);
        if (response.data.role === 'Admin') {
          navigate('/admin'); // Mengarahkan ke halaman admin jika role adalah Admin
        } else {
          navigate('/'); // Mengarahkan ke halaman home jika bukan Admin
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="signin-form-container">
      <h2 className="modal-title">Sign In</h2>
      <Link to="/signin-admin" className="admin-button">
        <button>Go to Admin</button>
      </Link>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Username" onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} />
        </div>
        <div className="actions">
          <p className="help-link">Need Help?</p>
          <button type="submit" className="submit-btn">Log In</button>
        </div>
      </form>
      <p className='sign-in'>Do you have an account?<a href="/signup">Register</a></p>
    </div>
  );
}

export default SignIn;
