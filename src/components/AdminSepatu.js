import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminSepatu() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleCreateCategory = () => {
    axios.post('http://localhost:5000/api/categories', { category_name: newCategory })
      .then(() => {
        fetchCategories();
        setNewCategory('');
        Swal.fire('Success!', 'Category created successfully!', 'success');
      })
      .catch(error => {
        console.error('Error creating category:', error);
        Swal.fire('Error!', 'Failed to create category.', 'error');
      });
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
  };

  const handleUpdateCategory = () => {
    axios.put(`http://localhost:5000/api/categories/${editCategory.category_id}`, { category_name: editCategory.category_name })
      .then(() => {
        fetchCategories();
        setEditCategory(null);
        Swal.fire('Success!', 'Category updated successfully!', 'success');
      })
      .catch(error => {
        console.error('Error updating category:', error);
        Swal.fire('Error!', 'Failed to update category.', 'error');
      });
  };

  const handleDeleteCategory = (categoryId) => {
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
        axios.delete(`http://localhost:5000/api/categories/${categoryId}`)
          .then(() => {
            fetchCategories();
            Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting category:', error);
            Swal.fire('Error!', 'Failed to delete category.', 'error');
          });
      }
    });
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Kategori Sepatu</h1>
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="Nama Kategori Baru"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleCreateCategory}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Category
        </button>
      </div>
      <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nama Kategori</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.category_id} className="text-center border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{category.category_id}</td>
              <td className="px-4 py-2">
                {editCategory && editCategory.category_id === category.category_id ? (
                  <input
                    type="text"
                    value={editCategory.category_name}
                    onChange={(e) => setEditCategory({ ...editCategory, category_name: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  category.category_name
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editCategory && editCategory.category_id === category.category_id ? (
                  <button 
                    onClick={handleUpdateCategory}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteCategory(category.category_id)}
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

export default AdminSepatu;
