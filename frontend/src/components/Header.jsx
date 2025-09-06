import React from 'react';
import { FiSearch, FiBell, FiMoon, FiSun } from 'react-icons/fi';

// A simple placeholder for the user avatar
const UserAvatar = () => (
  <img
    className="h-9 w-9 rounded-full object-cover"
    src="https://via.placeholder.com/150" // Replace with actual user image if available
    alt="User Avatar"
  />
);

const Header = ({ title, isDarkMode, setIsDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center transition-colors duration-300">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, projects..."
            className="w-64 pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button className="relative text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;