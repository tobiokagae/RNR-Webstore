import React, { useState } from "react";
import "./css/ProfilePage.css"; // Import CSS

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "johndoe",
    email: "johndoe@example.com",
    first_name: "John",
    last_name: "Doe",
    address: "123 Main St, Springfield",
    phone: "123-456-7890",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData); // Simulasi update
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      {editMode ? (
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <p>Username: {formData.username}</p>
          <p>Email: {formData.email}</p>
          <p>First Name: {formData.first_name}</p>
          <p>Last Name: {formData.last_name}</p>
          <p>Address: {formData.address}</p>
          <p>Phone: {formData.phone}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
