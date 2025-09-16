import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiEdit, FiUser, FiMail, FiPhone, FiCalendar, 
  FiBriefcase, FiMapPin, FiAward, FiClock, FiDollarSign 
} from 'react-icons/fi';

// A helper component to display profile details neatly
const DetailItem = ({ icon, label, value, className = '' }) => (
  <div className={`flex items-center py-3 ${className}`}>
    <div className="mr-4 text-gray-400 dark:text-gray-500">{icon}</div>
    <div className="w-1/3 font-medium text-gray-500 dark:text-gray-400">{label}</div>
    <div className="flex-1 text-gray-800 dark:text-gray-200 font-medium">{value || '-'}</div>
  </div>
);

const Profile = () => {
  const { user } = useAuth(); // Get basic user info from context
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('employeeToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // This endpoint should fetch the logged-in user's full profile from the backend
        const { data } = await axios.get('/api/employees/profile', config);
        setEmployee(data);
      } catch (err) {
        setError('Failed to fetch profile details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and manage your personal and professional information
          </p>
        </div>
        <Link
          to="/employee-dashboard/edit-profile"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200"
        >
          <FiEdit className="text-lg" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Profile Card */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="relative inline-block">
              <img
                src={employee.imageUrl || `http://localhost:5000/uploads/${employee.image}` || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-100 dark:border-gray-600 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full">
                <FiUser className="text-white" size={16} />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">{employee.name}</h2>
            <p className="text-teal-600 dark:text-teal-400 font-medium">{employee.designation}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{employee.department}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Employee ID</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{employee.employeeId}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>Status</span>
                <span className="inline-flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Employment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FiClock className="text-gray-400 mr-3" size={16} />
                <span className="text-gray-500 dark:text-gray-400">Joined</span>
                <span className="ml-auto text-gray-800 dark:text-gray-200">
                  {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <FiAward className="text-gray-400 mr-3" size={16} />
                <span className="text-gray-500 dark:text-gray-400">Experience</span>
                <span className="ml-auto text-gray-800 dark:text-gray-200">2.5 years</span>
              </div>
              <div className="flex items-center text-sm">
                <FiDollarSign className="text-gray-400 mr-3" size={16} />
                <span className="text-gray-500 dark:text-gray-400">Salary</span>
                <span className="ml-auto text-gray-800 dark:text-gray-200">$5,200/mo</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Detailed Information */}
        <main className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'personal'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('job')}
                  className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'job'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Job Information
                </button>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'emergency'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Emergency Contact
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    Personal Details
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <DetailItem 
                      icon={<FiUser size={18} />} 
                      label="Full Name" 
                      value={employee.name} 
                    />
                    <DetailItem 
                      icon={<FiMail size={18} />} 
                      label="Email Address" 
                      value={employee.email} 
                    />
                    <DetailItem 
                      icon={<FiPhone size={18} />} 
                      label="Phone Number" 
                      value={employee.phone} 
                    />
                    <DetailItem 
                      icon={<FiCalendar size={18} />} 
                      label="Date of Birth" 
                      value={employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'} 
                    />
                    <DetailItem 
                      icon={<FiMapPin size={18} />} 
                      label="Address" 
                      value={employee.address || 'Not specified'} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    Job Information
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <DetailItem 
                      icon={<FiBriefcase size={18} />} 
                      label="Employee ID" 
                      value={employee.employeeId} 
                    />
                    <DetailItem 
                      icon={<FiMapPin size={18} />} 
                      label="Department" 
                      value={employee.department} 
                    />
                    <DetailItem 
                      icon={<FiBriefcase size={18} />} 
                      label="Designation" 
                      value={employee.designation} 
                    />
                    <DetailItem 
                      icon={<FiCalendar size={18} />} 
                      label="Date Joined" 
                      value={employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'} 
                    />
                    <DetailItem 
                      icon={<FiAward size={18} />} 
                      label="Employment Type" 
                      value={employee.employmentType || 'Full-time'} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'emergency' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    Emergency Contact
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      This information is critical for emergency situations. Please ensure it's always up to date.
                    </p>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <DetailItem 
                      icon={<FiUser size={18} />} 
                      label="Contact Name" 
                      value={employee.emergencyContact?.name || 'Not specified'} 
                    />
                    <DetailItem 
                      icon={<FiPhone size={18} />} 
                      label="Contact Phone" 
                      value={employee.emergencyContact?.phone || 'Not specified'} 
                    />
                    <DetailItem 
                      icon={<FiBriefcase size={18} />} 
                      label="Relationship" 
                      value={employee.emergencyContact?.relationship || 'Not specified'} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills && employee.skills.length > 0 ? (
                  employee.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No skills listed</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Recent Activities</h3>
              <ul className="space-y-3">
                <li className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Profile updated</span> - 2 days ago
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Completed training</span> - 1 week ago
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Performance review</span> - 2 weeks ago
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;