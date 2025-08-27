import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Optional: for more advanced checks

const EmployeeProtectedRoute = ({ children }) => {
  // Simple check: Does the employee token exist in localStorage?
  const token = localStorage.getItem('employeeToken');

  if (!token) {
    // If no token is found, redirect to the employee login page
    return <Navigate to="/employee-login" replace />;
  }

  // If the token exists, render the component that was passed as a child
  // (e.g., the EmployeeDashboard)
  return children;
};

export default EmployeeProtectedRoute;