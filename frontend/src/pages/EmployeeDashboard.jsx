import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaFileAlt, FaDollarSign, FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: 'Your leave request is under review.' },
    { id: 2, message: 'Salary credited for this month.' }
  ]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('employeeToken'); 
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-gray-700' : ''
    }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-center text-teal-400 tracking-wide">
          Employee Portal
        </h1>
        <nav className="flex-grow space-y-2">
          <NavLink to="profile" className={navLinkClasses}>
            <FaUser className="mr-3" />
            Profile
          </NavLink>
          <NavLink to="apply-leave" className={navLinkClasses}>
            <FaFileAlt className="mr-3" />
            Apply for Leave
          </NavLink>
          <NavLink to="salary-history" className={navLinkClasses}>
            <FaDollarSign className="mr-3" />
            Salary History
          </NavLink>
          <NavLink to="notifications" className={navLinkClasses}>
            <FaBell className="mr-3" />
            Notifications
          </NavLink>
          <NavLink to="settings" className={navLinkClasses}>
            <FaCog className="mr-3" />
            Settings
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-gray-700 pt-4">
          <div className="p-2 mb-2">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email || user?.employeeId}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top bar with welcome & notifications preview */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
           
          </h2>
          <div className="relative group">
            <button className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <FaBell className="text-gray-600 dark:text-gray-300" />
              <span className="ml-2 text-sm">{notifications.length}</span>
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block z-10">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <li key={note.id} className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {note.message}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-sm text-gray-500">No notifications</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Child Components */}
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboard;
