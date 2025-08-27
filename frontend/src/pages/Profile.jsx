import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h2>
        <Link to="/employee-dashboard/edit-profile" className="flex items-center text-teal-600 hover:text-teal-500">
          <FaEdit className="mr-2" /> Edit Profile
        </Link>
      </div>
      {user ? (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {/* Add other user details here */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
