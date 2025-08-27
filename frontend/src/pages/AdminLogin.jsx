// d:\EMS\frontend\src\pages\AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from 'framer-motion';
import "../styles/Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ CORRECTED: Check for role directly on response.data
      if (response.data.token && response.data.role === 'admin') {
        const user = response.data; // The whole data object is the user
        const token = response.data.token;

        login(user);
        localStorage.setItem("adminToken", token); // Use 'adminToken' for consistency
        
        setMessage(`✅ Welcome, Admin ${user.name || user.email}`);
        setTimeout(() => navigate("/admin-dashboard"), 1200);
      } else {
        setMessage("❌ Invalid credentials or not an admin.");
      }
    } catch (error) {
      setMessage("❌ Login failed. Please try again.");
      console.error("Admin Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors duration-500 ease-in-out ${isDarkMode ? "bg-gray-900" : "bg-gray-100"} p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-8 rounded-xl w-full sm:w-[400px] shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        <button onClick={() => setIsDarkMode((prev) => !prev)} className="mb-4 text-sm text-teal-500 hover:underline transition">
          Switch to {isDarkMode ? "Light" : "Dark"} Mode
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label>Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded transition duration-300" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <div className="flex items-center">
              <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 border rounded transition duration-300" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-sm text-teal-600">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <button type="submit" className="w-full py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition duration-300" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </motion.div>
          {message && (
            <motion.p className="text-sm text-center mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;