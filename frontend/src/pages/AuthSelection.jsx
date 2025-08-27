// d:\EMS\frontend\src\pages\AuthSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8">
          Welcome to the Employee Management System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Please select your role to continue.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // ✅ CORRECTED PATH
            onClick={() => navigate('/admin-login')}
            className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 text-lg"
          >
            Admin Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // ✅ CORRECTED PATH
            onClick={() => navigate('/employee-login')}
            className="px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300 text-lg"
          >
            Employee Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthSelection;