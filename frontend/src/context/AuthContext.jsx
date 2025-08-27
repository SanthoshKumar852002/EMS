import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs once when the app first loads
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('employeeToken') || localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          // Call the new backend route to get the user's data
          const { data } = await axios.get('/api/auth/profile', config);
          setUser(data); // Restore the user session
        } catch (error) {
          console.error("Session has expired or token is invalid. Please log in again.");
          // Clear any invalid tokens
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []); // The empty array ensures this runs only once

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('adminToken');
  };

  // Do not render the main app until the token check is complete
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};