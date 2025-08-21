// src/pages/LeavesDashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LeaveTable from '../components/LeaveTable';
import LeaveForm from '../components/Leaveform'; // ✅ Renamed
import axios from 'axios';

const LeavesDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('/api/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeaves = leaves.filter((leave) =>
    leave.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    leave.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header title="Leave Management System" />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Leave Dashboard</h2>
          <input
            type="text"
            placeholder="Search by Employee ID / Type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />
        </div>

        {/* ✅ Leave Apply Form */}
        <LeaveForm onLeaveApplied={fetchLeaves} />

        {/* ✅ Leave Table */}
        <LeaveTable leaves={filteredLeaves} onStatusChange={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default LeavesDashboard;
