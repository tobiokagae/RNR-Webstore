import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AdminSepatuDetail() {
  const navigate = useNavigate();
  const [shoes, setShoes] = useState([]);
  const [newShoe, setNewShoe] = useState({
    category_id: '',
    shoe_name: '',
    shoe_price: '',
    shoe_size: '',
    stock: ''
  });
  const [editShoe, setEditShoe] = useState(null);

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = () => {
    axios.get('http://localhost:5000/api/shoes')
      .then(response => {
        setShoes(response.data);
      })
      .catch(error => {
        console.error('Error fetching shoes:', error);
      });
  };

  const handleCreateShoe = () => {
    axios.post('http://localhost:5000/api/shoes', newShoe)
      .then(() => {
        fetchShoes();
        setNewShoe({
          category_id: '',
          shoe_name: '',
          shoe_price: '',
          shoe_size: '',
          stock: ''
        });
        Swal.fire('Success!', 'Shoe created successfully!', 'success');
      })
      .catch(error => {
        console.error('Error creating shoe:', error);
        Swal.fire('Error!', 'Failed to create shoe.', 'error');
      });
  };

  const handleEditShoe = (shoe) => {
    setEditShoe(shoe);
  };

  const handleUpdateShoe = () => {
    axios.put(`http://localhost:5000/api/shoes/${editShoe.shoe_detail_id}`, editShoe)
      .then(() => {
        fetchShoes();
        setEditShoe(null);
        Swal.fire('Success!', 'Shoe updated successfully!', 'success');
      })
      .catch(error => {
        console.error('Error updating shoe:', error);
        Swal.fire('Error!', 'Failed to update shoe.', 'error');
      });
  };

  const handleDeleteShoe = (shoeId) => {
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
        axios.delete(`http://localhost:5000/api/shoes/${shoeId}`)
          .then(() => {
            fetchShoes();
            Swal.fire('Deleted!', 'Your shoe has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting shoe:', error);
            Swal.fire('Error!', 'Failed to delete shoe.', 'error');
          });
      }
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Sepatu</h1>
      <button 
        onClick={handleBack}
        className="bg-gray-600 text-white p-2 rounded-md mb-6 hover:bg-gray-700 transition duration-300"
      >
        Kembali ke Admin
      </button>
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="ID Kategori"
          value={newShoe.category_id}
          onChange={(e) => setNewShoe({ ...newShoe, category_id: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Nama Sepatu"
          value={newShoe.shoe_name}
          onChange={(e) => setNewShoe({ ...newShoe, shoe_name: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Harga"
          value={newShoe.shoe_price}
          onChange={(e) => setNewShoe({ ...newShoe, shoe_price: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Ukuran"
          value={newShoe.shoe_size}
          onChange={(e) => setNewShoe({ ...newShoe, shoe_size: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Stok"
          value={newShoe.stock}
          onChange={(e) => setNewShoe({ ...newShoe, stock: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <button 
          onClick={handleCreateShoe}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Shoe
        </button>
      </div>
      <table className="table-auto w-full bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">ID Sepatu</th>
            <th className="px-4 py-2">Nama Sepatu</th>
            <th className="px-4 py-2">Harga</th>
            <th className="px-4 py-2">Ukuran</th>
            <th className="px-4 py-2">Stok</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {shoes.map(shoe => (
            <tr key={shoe.shoe_detail_id} className="text-center border-b border-gray-700">
              <td className="px-4 py-2">{shoe.shoe_detail_id}</td>
              <td className="px-4 py-2">
                {editShoe && editShoe.shoe_detail_id === shoe.shoe_detail_id ? (
                  <input
                    type="text"
                    value={editShoe.shoe_name}
                    onChange={(e) => setEditShoe({ ...editShoe, shoe_name: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  shoe.shoe_name
                )}
              </td>
              <td className="px-4 py-2">
                {editShoe && editShoe.shoe_detail_id === shoe.shoe_detail_id ? (
                  <input
                    type="text"
                    value={editShoe.shoe_price}
                    onChange={(e) => setEditShoe({ ...editShoe, shoe_price: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  shoe.shoe_price
                )}
              </td>
              <td className="px-4 py-2">
                {editShoe && editShoe.shoe_detail_id === shoe.shoe_detail_id ? (
                  <input
                    type="text"
                    value={editShoe.shoe_size}
                    onChange={(e) => setEditShoe({ ...editShoe, shoe_size: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  shoe.shoe_size
                )}
              </td>
              <td className="px-4 py-2">
                {editShoe && editShoe.shoe_detail_id === shoe.shoe_detail_id ? (
                  <input
                    type="text"
                    value={editShoe.stock}
                    onChange={(e) => setEditShoe({ ...editShoe, stock: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white"
                  />
                ) : (
                  shoe.stock
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editShoe && editShoe.shoe_detail_id === shoe.shoe_detail_id ? (
                  <button 
                    onClick={handleUpdateShoe}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditShoe(shoe)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteShoe(shoe.shoe_detail_id)}
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

export default AdminSepatuDetail;
