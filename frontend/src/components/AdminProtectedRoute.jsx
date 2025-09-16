import React from 'react';
import { Navigate } from 'react-router-dom';
 // Optional: for more advanced checks

const AdminProtectedRoute = ({ children }) => {
  // Simple check: Does the admin token exist in localStorage?
  const token = localStorage.getItem('adminToken');

  if (!token) {

    return <Navigate to="/admin-login" replace />;
  }


  return children;
};

export default AdminProtectedRoute;