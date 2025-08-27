import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaFileAlt, FaDollarSign, FaSignOutAlt } from 'react-icons/fa';

const EmployeeDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Ensure the correct token is removed upon logout
    localStorage.removeItem('employeeToken'); 
    navigate('/');
  };

  // This function adds styling to the active navigation link
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-gray-700' : ''
    }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8 text-center text-teal-400">Dashboard</h1>
        <nav className="flex-grow space-y-2">
          {/* ✅ NavLink paths are now simpler and relative to the parent */}
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
        </nav>
        <div className="mt-auto">
           <div className="p-4 border-t border-gray-700">
              <p className="text-sm font-semibold">{user?.name}</p>
              {/* Show employeeId if email is not available */}
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
        {/* The Outlet will render the correct child component (Profile, etc.) */}
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboard;