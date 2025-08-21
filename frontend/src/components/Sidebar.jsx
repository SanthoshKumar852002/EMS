// ✅ New: Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: '🏠 Dashboard', path: '/admin-dashboard' },
    { name: '👥 Employees', path: '/admin/employees' },
    { name: '🏢 Departments', path: '/admin/departments' },
    { name: '📅 Leaves', path: '/admin/leaves' },
    { name: '💰 Salary', path: '/admin/salary' },
    { name: '⚙️ Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-black text-white p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📂 Admin Panel</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-green-700 transition-all ${isActive ? 'bg-green-600' : 'bg-black'}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;