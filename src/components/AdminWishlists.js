import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminWishlists() {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlist, setNewWishlist] = useState({
    user_id: '',
    shoe_id: ''
  });
  const [editWishlist, setEditWishlist] = useState(null);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = () => {
    axios.get('http://localhost:5000/api/wishlists')
      .then(response => {
        setWishlists(response.data);
      })
      .catch(error => {
        console.error('Error fetching wishlists:', error);
      });
  };

  const handleCreateWishlist = () => {
    axios.post('http://localhost:5000/api/wishlists', newWishlist)
      .then(() => {
        fetchWishlists();
        setNewWishlist({ user_id: '', shoe_id: '' });
        Swal.fire('Success!', 'Wishlist created successfully!', 'success');
      })
      .catch(error => {
        console.error('Error creating wishlist:', error);
        Swal.fire('Error!', 'Failed to create wishlist.', 'error');
      });
  };

  const handleEditWishlist = (wishlist) => {
    setEditWishlist(wishlist);
  };

  const handleUpdateWishlist = () => {
    axios.put(`http://localhost:5000/api/wishlists/${editWishlist.wishlist_id}`, editWishlist)
      .then(() => {
        fetchWishlists();
        setEditWishlist(null);
        Swal.fire('Success!', 'Wishlist updated successfully!', 'success');
      })
      .catch(error => {
        console.error('Error updating wishlist:', error);
        Swal.fire('Error!', 'Failed to update wishlist.', 'error');
      });
  };

  const handleDeleteWishlist = (wishlistId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/api/wishlists/${wishlistId}`)
          .then(() => {
            fetchWishlists();
            Swal.fire('Deleted!', 'Wishlist has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting wishlist:', error);
            Swal.fire('Error!', 'Failed to delete wishlist.', 'error');
          });
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Wishlist</h1>
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="User ID"
          value={newWishlist.user_id}
          onChange={(e) => setNewWishlist({ ...newWishlist, user_id: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Shoe ID"
          value={newWishlist.shoe_id}
          onChange={(e) => setNewWishlist({ ...newWishlist, shoe_id: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <button 
          onClick={handleCreateWishlist}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Wishlist
        </button>
      </div>
      <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-2">Wishlist ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Shoe ID</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlists.map(wishlist => (
            <tr key={wishlist.wishlist_id} className="text-center border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{wishlist.wishlist_id}</td>
              <td className="px-4 py-2">
                {editWishlist && editWishlist.wishlist_id === wishlist.wishlist_id ? (
                  <input
                    type="text"
                    value={editWishlist.user_id}
                    onChange={(e) => setEditWishlist({ ...editWishlist, user_id: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  wishlist.user_id
                )}
              </td>
              <td className="px-4 py-2">
                {editWishlist && editWishlist.wishlist_id === wishlist.wishlist_id ? (
                  <input
                    type="text"
                    value={editWishlist.shoe_id}
                    onChange={(e) => setEditWishlist({ ...editWishlist, shoe_id: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  wishlist.shoe_id
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editWishlist && editWishlist.wishlist_id === wishlist.wishlist_id ? (
                  <button 
                    onClick={handleUpdateWishlist}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditWishlist(wishlist)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteWishlist(wishlist.wishlist_id)}
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
  );
}

export default AdminWishlists;