import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Menambahkan state loading

  const token = localStorage.getItem("token"); // Ambil token dari localStorage

  // Ambil data profil pengguna saat pertama kali komponen dimuat
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userIdFromStorage = localStorage.getItem("user_id");
      setUserId(userIdFromStorage);

      if (userIdFromStorage && token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${userIdFromStorage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFormData({
            username: response.data.username || "",
            email: response.data.email || "",
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            address: response.data.address || "",
            phone: response.data.phone || "",
          });
          setLoading(false); // Data berhasil dimuat
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLoading(false); // Set loading selesai meski terjadi error
        }
      }
    };
    fetchUserProfile();
  }, [token]); // Memastikan efek hanya terjadi saat token berubah

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
      });

      console.log("Profile updated:", response.data);
      setEditMode(false); // Set edit mode off after successful update
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating your profile. Please try again.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Menunggu data dimuat
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-300 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Profile</h1>
      {editMode ? (
        <form className="space-y-4 text-black" onSubmit={handleUpdateProfile}>
          <div>
            <label className="block text-sm font-medium text-black">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              First Name:
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Last Name:
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md border-gray-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-full bg-gray-400 text-white py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            Username: {formData.username}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Email: {formData.email}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            First Name: {formData.first_name}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Last Name: {formData.last_name}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Address: {formData.address}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Phone: {formData.phone}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-600 text-white py-2 px-4 rounded-md"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
