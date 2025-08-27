import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, login } = useAuth(); // Get the login function to update context
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill the form with the current user's data when the component loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPreview(user.image ? `http://localhost:5000/uploads/${user.image}` : '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('employeeToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put('/api/employees/profile', formData, config);
      
      // Update the user state in the AuthContext with the new data
      login(data, 'employee'); 
      
      Swal.fire('Success!', 'Your profile has been updated.', 'success');
      navigate('/employee-dashboard/profile'); // Go back to the profile page
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <img 
            src={preview || 'https://via.placeholder.com/150'} 
            alt="Profile Preview" 
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-300"
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;