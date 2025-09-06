import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiSettings } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

//==================================================================
//  Panel 1: Profile Settings
//==================================================================
const ProfilePanel = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || 'Admin User');
      setEmail(user.email || 'admin@example.com');
    }
  }, [user]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    Swal.fire('Success!', 'Profile updated successfully.', 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Profile Information</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

//==================================================================
//  Panel 2: Security Settings
//==================================================================
const SecurityPanel = () => {
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    Swal.fire('Success!', 'Password changed successfully.', 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Security</h2>
      <form onSubmit={handlePasswordUpdate} className="space-y-6 border-b dark:border-gray-700 pb-8">
        <h3 className="font-semibold text-lg dark:text-gray-200">Change Password</h3>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300">Current Password</label>
          <input
            type="password"
            className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">New Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Update Password
          </button>
        </div>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold text-lg dark:text-gray-200">Two-Factor Authentication (2FA)</h3>
        <p className="text-sm text-gray-500 mt-2">Add an extra layer of security to your account.</p>
        <button className="mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded-lg transition-colors">
          Enable 2FA
        </button>
      </div>
    </div>
  );
};


//==================================================================
//  Panel 3: General Settings
//==================================================================
const GeneralPanel = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">General Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium dark:text-gray-300">Company Name</label>
          <input
            type="text"
            defaultValue="EMS Pro"
            className="mt-1 w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
            <label className="block text-sm font-medium dark:text-gray-300">Company Logo</label>
            <div className="mt-2 flex items-center gap-4">
                <img className="h-16 w-16 rounded-md object-cover bg-gray-200" src="https://via.placeholder.com/150" alt="Current Logo"/>
                <input type="file" className="text-sm dark:text-gray-300" />
            </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => Swal.fire('Success!', 'General settings saved.', 'success')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};


//==================================================================
//  MAIN SETTINGS PAGE COMPONENT
//==================================================================
const TABS = [
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
  { id: 'security', label: 'Security', icon: <FiLock /> },
  { id: 'general', label: 'General', icon: <FiSettings /> },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePanel />;
      case 'security':
        return <SecurityPanel />;
      case 'general':
        return <GeneralPanel />;
      default:
        return null;
    }
  };

  return (
    // ✅ This is the correct structure for a self-contained page
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Admin Settings" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Vertical Tab Navigation */}
            <aside className="md:w-1/4">
              <nav className="space-y-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Tab Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;