import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminInteractions() {
  const [interactions, setInteractions] = useState([]);
  const [newInteraction, setNewInteraction] = useState({
    id_user: '',
    shoe_detail_id: '',
    interaction_type: ''
  });
  const [editInteraction, setEditInteraction] = useState(null);

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = () => {
    axios.get('http://localhost:5000/api/user_interactions') // Use the correct endpoint
      .then(response => {
        setInteractions(response.data);
      })
      .catch(error => {
        console.error('Error fetching interactions:', error);
      });
  };

  const handleCreateInteraction = () => {
    // Validate before creating interaction
    if (!newInteraction.id_user || !newInteraction.shoe_detail_id || !newInteraction.interaction_type) {
      Swal.fire('Error!', 'All fields are required.', 'error');
      return;
    }

    axios.post('http://localhost:5000/api/user_interactions', newInteraction) // Use the correct endpoint
      .then(() => {
        fetchInteractions();
        setNewInteraction({ id_user: '', shoe_detail_id: '', interaction_type: '' });
        Swal.fire('Success!', 'Interaction created successfully!', 'success');
      })
      .catch(error => {
        console.error('Error creating interaction:', error);
        Swal.fire('Error!', 'Failed to create interaction.', 'error');
      });
  };

  const handleEditInteraction = (interaction) => {
    setEditInteraction(interaction);
  };

  const handleUpdateInteraction = () => {
    // Validate before updating interaction
    if (!editInteraction.id_user || !editInteraction.shoe_detail_id || !editInteraction.interaction_type) {
      Swal.fire('Error!', 'All fields are required.', 'error');
      return;
    }

    axios.put(`http://localhost:5000/api/user_interactions/${editInteraction.interaction_id}`, editInteraction) // Use the correct endpoint
      .then(() => {
        fetchInteractions();
        setEditInteraction(null);
        Swal.fire('Success!', 'Interaction updated successfully!', 'success');
      })
      .catch(error => {
        console.error('Error updating interaction:', error);
        Swal.fire('Error!', 'Failed to update interaction.', 'error');
      });
  };

  const handleDeleteInteraction = (interactionId) => {
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
        axios.delete(`http://localhost:5000/api/user_interactions/${interactionId}`) // Use the correct endpoint
          .then(() => {
            fetchInteractions();
            Swal.fire('Deleted!', 'Interaction has been deleted.', 'success');
          })
          .catch(error => {
            console.error('Error deleting interaction:', error);
            Swal.fire('Error!', 'Failed to delete interaction.', 'error');
          });
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">User Interactions</h1>
      <div className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="User ID"
          value={newInteraction.id_user}
          onChange={(e) => setNewInteraction({ ...newInteraction, id_user: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Shoe Detail ID"
          value={newInteraction.shoe_detail_id}
          onChange={(e) => setNewInteraction({ ...newInteraction, shoe_detail_id: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Interaction Type"
          value={newInteraction.interaction_type}
          onChange={(e) => setNewInteraction({ ...newInteraction, interaction_type: e.target.value })}
          className="p-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleCreateInteraction}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Interaction
        </button>
      </div>
      <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Shoe Detail ID</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map(interaction => (
            <tr key={interaction.interaction_id} className="text-center border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{interaction.interaction_id}</td>
              <td className="px-4 py-2">
                {editInteraction && editInteraction.interaction_id === interaction.interaction_id ? (
                  <input
                    type="text"
                    value={editInteraction.id_user}
                    onChange={(e) => setEditInteraction({ ...editInteraction, id_user: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  interaction.id_user
                )}
              </td>
              <td className="px-4 py-2">
                {editInteraction && editInteraction.interaction_id === interaction.interaction_id ? (
                  <input
                    type="text"
                    value={editInteraction.shoe_detail_id}
                    onChange={(e) => setEditInteraction({ ...editInteraction, shoe_detail_id: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  interaction.shoe_detail_id
                )}
              </td>
              <td className="px-4 py-2">
                {editInteraction && editInteraction.interaction_id === interaction.interaction_id ? (
                  <input
                    type="text"
                    value={editInteraction.interaction_type}
                    onChange={(e) => setEditInteraction({ ...editInteraction, interaction_type: e.target.value })}
                    className="p-1 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  interaction.interaction_type
                )}
              </td>
              <td className="px-4 py-2 flex justify-center space-x-2">
                {editInteraction && editInteraction.interaction_id === interaction.interaction_id ? (
                  <button 
                    onClick={handleUpdateInteraction}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditInteraction(interaction)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteInteraction(interaction.interaction_id)}
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

export default AdminInteractions;
