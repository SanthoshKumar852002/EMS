import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Optional: for more advanced checks

const AdminProtectedRoute = ({ children }) => {
  // Simple check: Does the admin token exist in localStorage?
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // If no token is found, redirect to the admin login page
    return <Navigate to="/admin-login" replace />;
  }

  // If the token exists, render the component that was passed as a child
  // (e.g., the AdminDashboard)
  return children;
};

export default AdminProtectedRoute;