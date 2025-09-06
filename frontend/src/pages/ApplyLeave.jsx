import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth

const ApplyLeave = () => {
  const { user } = useAuth(); // ✅ Get the logged-in user's data
  
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Get the employee token from localStorage
      const token = localStorage.getItem('employeeToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // ✅ Combine form data with the logged-in user's ID
      const leaveData = {
        ...formData,
        employeeId: user._id, // Use the secure database ID from the logged-in user
      };

      await axios.post('/api/leaves', leaveData, config);

      Swal.fire('Success', 'Leave Applied Successfully!', 'success');
      setFormData({
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
      });

    } catch (error) {
      console.error("Leave application error:", error);
      Swal.fire('Error', 'Failed to apply leave!', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* We no longer need a manual Employee ID input */}

        <div>
          <label className="block text-sm font-medium dark:text-gray-300">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Paid Leave">Paid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-300">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Apply Leave
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;