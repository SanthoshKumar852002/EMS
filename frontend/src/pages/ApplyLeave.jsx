import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiPlus,
  FiInfo,
  FiAlertTriangle
} from 'react-icons/fi';

// Helper component for colored status badges
const StatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
  if (status === 'Approved') {
    return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}><FiCheckCircle size={14} /> Approved</span>;
  }
  if (status === 'Rejected') {
    return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}><FiXCircle size={14} /> Rejected</span>;
  }
  return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`}><FiClock size={14} /> Pending</span>;
};

// Helper component for leave balance display
const LeaveBalanceCard = ({ type, available, total }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{type}</h4>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{available}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">/ {total}</span>
      </div>
      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-teal-500 h-2 rounded-full" 
          style={{ width: `${(available / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const ApplyLeave = () => {
  const { user } = useAuth();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    casual: 12,
    sick: 10,
    paid: 15
  });
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [calculatingDays, setCalculatingDays] = useState(false);
  const [leaveDays, setLeaveDays] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Calculate leave days when dates change
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      setCalculatingDays(true);
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      
      // Calculate business days (excluding weekends)
      let days = 0;
      let currentDate = new Date(from);
      
      while (currentDate <= to) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
          days++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setLeaveDays(days);
      setCalculatingDays(false);
    } else {
      setLeaveDays(0);
    }
  }, [formData.fromDate, formData.toDate]);

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem('employeeToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/leaves/my-history', config);
      setLeaveHistory(data);
    } catch (error) {
      console.error("Could not fetch leave history", error);
      Swal.fire('Error', 'Failed to load leave history', 'error');
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      Swal.fire('Error', 'End date must be after start date', 'error');
      return;
    }
    
    // Check leave balance
    if (leaveBalance[formData.leaveType.toLowerCase().replace(' ', '')] < leaveDays) {
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Leave Balance',
        text: `You don't have enough ${formData.leaveType} days remaining.`,
        showCancelButton: true,
        confirmButtonText: 'Apply Anyway',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (!result.isConfirmed) return;
      });
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('employeeToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const leaveData = { 
        ...formData, 
        employeeId: user._id,
        days: leaveDays
      };
      
      await axios.post('/api/leaves', leaveData, config);
      
      Swal.fire({
        icon: 'success',
        title: 'Leave Applied Successfully!',
        text: `Your ${formData.leaveType} request for ${leaveDays} days has been submitted.`,
        timer: 3000,
        showConfirmButton: false
      });
      
      setFormData({ leaveType: '', fromDate: '', toDate: '', reason: '' });
      setLeaveDays(0);
      fetchLeaveHistory(); // Refresh history after applying
      
      // Update leave balance (in a real app, this would come from the backend)
      if (formData.leaveType) {
        const leaveKey = formData.leaveType.toLowerCase().replace(' ', '');
        setLeaveBalance(prev => ({
          ...prev,
          [leaveKey]: prev[leaveKey] - leaveDays
        }));
      }
    } catch (error) {
      console.error("Leave application error:", error);
      Swal.fire('Error', 'Failed to apply leave. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate available leave types based on balance
  const availableLeaveTypes = [
    { value: 'Casual Leave', disabled: leaveBalance.casual <= 0 },
    { value: 'Sick Leave', disabled: leaveBalance.sick <= 0 },
    { value: 'Paid Leave', disabled: leaveBalance.paid <= 0 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Apply for leave and track your requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Leave Balance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiInfo className="mr-2 text-teal-500" />
              Leave Balance
            </h3>
            <div className="space-y-4">
              <LeaveBalanceCard type="Casual Leave" available={leaveBalance.casual} total={12} />
              <LeaveBalanceCard type="Sick Leave" available={leaveBalance.sick} total={10} />
              <LeaveBalanceCard type="Paid Leave" available={leaveBalance.paid} total={15} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Leave Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Applications</span>
                <span className="font-medium text-gray-800 dark:text-white">{leaveHistory.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Approved</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {leaveHistory.filter(item => item.status === 'Approved').length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Pending</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {leaveHistory.filter(item => item.status === 'Pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form and History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Apply for Leave Form Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiPlus className="mr-2 text-teal-500" />
              Apply for Leave
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leave Type</label>
                  <select 
                    name="leaveType" 
                    value={formData.leaveType} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Leave Type</option>
                    {availableLeaveTypes.map((type) => (
                      <option 
                        key={type.value} 
                        value={type.value}
                        disabled={type.disabled}
                        className={type.disabled ? 'text-gray-400' : ''}
                      >
                        {type.value} {type.disabled ? '(No balance)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 dark:text-blue-300">Leave Days</span>
                    <span className="text-xl font-bold text-blue-800 dark:text-blue-200">
                      {calculatingDays ? 'Calculating...' : leaveDays}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Date</label>
                  <input 
                    type="date" 
                    name="fromDate" 
                    value={formData.fromDate} 
                    onChange={handleChange} 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Date</label>
                  <input 
                    type="date" 
                    name="toDate" 
                    value={formData.toDate} 
                    onChange={handleChange} 
                    required 
                    min={formData.fromDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
                <textarea 
                  name="reason" 
                  value={formData.reason} 
                  onChange={handleChange} 
                  rows={4} 
                  required 
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <FiAlertTriangle className="mr-2 text-yellow-500" />
                  Applications are subject to manager approval
                </div>
                <button 
                  type="submit" 
                  disabled={submitting || leaveDays === 0}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <FiFileText size={16} />
                      Apply Leave
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Leave History Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiCalendar className="mr-2 text-teal-500" />
              My Leave History
            </h3>
            
            {leaveHistory.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No leave history</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  You haven't applied for any leave yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Days
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leaveHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.leaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(item.fromDate).toLocaleDateString()} - {new Date(item.toDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.days || Math.floor((new Date(item.toDate) - new Date(item.fromDate)) / (1000 * 60 * 60 * 24)) + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;