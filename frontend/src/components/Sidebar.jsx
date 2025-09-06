import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Assuming you have a logout function here

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Or your equivalent logout function

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-600 text-white shadow-lg' : ''
    }`;

  return (
    <aside className="w-64 flex flex-col bg-[#111827] text-gray-200 min-h-screen p-4">
      <div className="text-2xl font-bold text-white mb-10 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          EMS Pro
        </span>
      </div>

      <nav className="flex-grow space-y-2">
        <NavLink to="/admin-dashboard" className={navLinkClasses}>
          <FiGrid className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/employees" className={navLinkClasses}>
          <FiUsers className="mr-3" />
          Employees
        </NavLink>
        <NavLink to="/admin/departments" className={navLinkClasses}>
          <FiBriefcase className="mr-3" />
          Departments
        </NavLink>
        <NavLink to="/admin/leaves" className={navLinkClasses}>
          <FiCalendar className="mr-3" />
          Leave Management
        </NavLink>
        <NavLink to="/admin/salary" className={navLinkClasses}>
          <FiDollarSign className="mr-3" />
          Salary
        </NavLink>
        <NavLink to="/admin/settings" className={navLinkClasses}>
          <FiUsers className="mr-3" />
          Settings
        </NavLink>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;