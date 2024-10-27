import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      alert(response.data.message);
      if (response.status === 200) {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-radial from-gray-800 via-gray-700 to-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl flex flex-col md:flex-row">
        <div className="md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <img src="/images/adidas_trail_run.png" alt="Shoes" className="w-full h-auto rounded" />
        </div>
        <div className="md:w-1/2 text-gray-900">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up Now</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="w-full bg-gray-200 text-gray-900 border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full bg-gray-200 text-gray-900 border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full bg-gray-200 text-gray-900 border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full bg-gray-200 text-gray-900 border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full bg-gray-200 text-gray-900 border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have a Roots&Routes account? <a href="/signin" className="text-blue-400">Log In</a>
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            By signing up, I agree to Roots&Routes's <a href="/" className="text-blue-400">Terms & Conditions</a> and <a href="/" className="text-blue-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
