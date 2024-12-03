import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

// Set up the modal styles
Modal.setAppElement("#root");

function AdminUser() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "User",
  });
  const [editUser, setEditUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  // Function to get the JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem("token"); // Assuming your JWT token is stored as 'token'
  };

  // Fetch all users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Add JWT token to Authorization header
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Create new user
  const handleCreateUser = () => {
    axios
      .post("http://localhost:5000/api/users/register", newUser, {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Add JWT token to Authorization header
        },
      })
      .then(() => {
        fetchUsers();
        setModalIsOpen(false);
        setNewUser({
          username: "",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
          role: "User",
        });
        Swal.fire("Success!", "User created successfully!", "success");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        Swal.fire("Error!", "Failed to create user.", "error");
      });
  };

  // Edit existing user
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleUpdateUser = () => {
    axios
      .put(
        `http://localhost:5000/api/users/profile/${editUser.user_id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Add JWT token to Authorization header
          },
        }
      )
      .then(() => {
        fetchUsers();
        setEditUser(null);
        Swal.fire("Success!", "User updated successfully!", "success");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        Swal.fire("Error!", "Failed to update user.", "error");
      });
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Add JWT token to Authorization header
            },
          })
          .then(() => {
            fetchUsers();
            Swal.fire("Deleted!", "User has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            Swal.fire("Error!", "Failed to delete user.", "error");
          });
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Users</h1>
      {/* <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600 transition duration-300"
      >
        Create User
      </button> */}
      <div className="overflow-x-auto w-full mt-5">
        <table className="table-auto w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="text-center border-b border-gray-700"
              >
                <td className="px-4 py-2">{user.user_id}</td>
                <td className="px-4 py-2">
                  {editUser && editUser.user_id === user.user_id ? (
                    <input
                      type="text"
                      value={editUser.username}
                      onChange={(e) =>
                        setEditUser({ ...editUser, username: e.target.value })
                      }
                      className="p-1 bg-gray-600 rounded-md text-white"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {editUser && editUser.user_id === user.user_id ? (
                    <input
                      type="text"
                      value={editUser.first_name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, first_name: e.target.value })
                      }
                      className="p-1 bg-gray-600 rounded-md text-white"
                    />
                  ) : (
                    user.first_name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editUser && editUser.user_id === user.user_id ? (
                    <input
                      type="text"
                      value={editUser.last_name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, last_name: e.target.value })
                      }
                      className="p-1 bg-gray-600 rounded-md text-white"
                    />
                  ) : (
                    user.last_name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editUser && editUser.user_id === user.user_id ? (
                    <select
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                      className="p-1 bg-gray-600 rounded-md text-white"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  {editUser && editUser.user_id === user.user_id ? (
                    <button
                      onClick={handleUpdateUser}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for Creating User
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-gray-800 p-6 rounded-md shadow-lg w-96"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="First Name"
          value={newUser.first_name}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.last_name}
          onChange={(e) =>
            setNewUser({ ...newUser, last_name: e.target.value })
          }
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 mb-4 w-full"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white mb-4 w-full"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create User
        </button>
        <button
          onClick={() => setModalIsOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ml-2"
        >
          Cancel
        </button>
      </Modal> */}
    </div>
  );
}

export default AdminUser;
