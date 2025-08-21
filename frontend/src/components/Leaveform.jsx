import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LeaveForm = ({ onLeaveApplied }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
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
      await axios.post('/api/leaves', formData);
      Swal.fire('Success', 'Leave Applied Successfully!', 'success');
      setFormData({
        employeeId: '',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
      });
      onLeaveApplied(); // refresh leave list
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to apply leave!', 'error');
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Select Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Paid Leave">Paid Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To Date</label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Apply Leave
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
