import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminWishlists() {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlist, setNewWishlist] = useState({
    id_user: '',
    shoe_detail_id: ''
  });
  const [editWishlist, setEditWishlist] = useState(null);

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = () => {
    axios.get('http://localhost:5000/api/wishlist') // sesuaikan endpoint backend jika diperlukan
      .then(response => {
        setWishlists(response.data);
      })
      .catch(error => {
        console.error('Error fetching wishlists:', error);
      });
  };

  const handleCreateWishlist = () => {
    axios.post('http://localhost:5000/api/wishlist', newWishlist)
      .then(() => {
        fetchWishlists();
        setNewWishlist({ id_user: '', shoe_detail_id: '' });
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
    axios.put(`http://localhost:5000/api/wishlist/${editWishlist.id_wishlist}`, editWishlist)
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
        axios.delete(`http://localhost:5000/api/wishlist/${wishlistId}`)
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
          value={newWishlist.id_user}
          onChange={(e) => setNewWishlist({ ...newWishlist, id_user: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Shoe Detail ID"
          value={newWishlist.shoe_detail_id}
          onChange={(e) => setNewWishlist({ ...newWishlist, shoe_detail_id: e.target.value })}
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
            <th className="px-4 py-2">Shoe Detail ID</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlists.map(wishlist => (
            <tr key={wishlist.id_wishlist} className="text-center border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{wishlist.id_wishlist}</td>
              <td className="px-4 py-2">
                {editWishlist && editWishlist.id_wishlist === wishlist.id_wishlist ? (
                  <input
                    type="text"
                    value={editWishlist.id_user}
                    onChange={(e) => setEditWishlist({ ...editWishlist, id_user: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  wishlist.id_user
                )}
              </td>
              <td className="px-4 py-2">
                {editWishlist && editWishlist.id_wishlist === wishlist.id_wishlist ? (
                  <input
                    type="text"
                    value={editWishlist.shoe_detail_id}
                    onChange={(e) => setEditWishlist({ ...editWishlist, shoe_detail_id: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  wishlist.shoe_detail_id
                )}
              </td>
              <td className="px-4 py-2 flex justify-center">
                {editWishlist && editWishlist.id_wishlist === wishlist.id_wishlist ? (
                  <button
                    onClick={handleUpdateWishlist}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300 mx-1"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditWishlist(wishlist)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300 mx-1"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteWishlist(wishlist.id_wishlist)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 mx-1"
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
