import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Enhanced Status Badge with better styling
const LeaveStatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 leading-tight';
  if (status === 'Approved') {
    return <span className={`${baseClasses} bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300`}><FiCheckCircle /> Approved</span>;
  }
  if (status === 'Rejected') {
    return <span className={`${baseClasses} bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300`}><FiXCircle /> Rejected</span>;
  }
  return <span className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300`}><FiClock /> Pending</span>;
};

// Enhanced Stat Card
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
);

const LeavesDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState('');

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('/api/leaves', config);
            setLeaves(res.data);
        } catch (err) {
            console.error("Failed to fetch leaves:", err);
            Swal.fire('Error', 'Could not fetch leave data.', 'error');
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // ✅ Revamped status update function with AUTH TOKEN
    const handleStatusUpdate = async (id, status) => {
        const result = await Swal.fire({
            title: `Confirm Action`,
            text: `Are you sure you want to ${status.toLowerCase()} this leave request?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'Approved' ? '#16a34a' : '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${status}`,
        });

        if (result.isConfirmed) {
            try {
                // Get token and create authorization header
                const token = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Send update request WITH the token
                await axios.put(`/api/leaves/${id}/status`, { status }, config);

                Swal.fire('Success!', `Leave has been ${status.toLowerCase()}.`, 'success');
                fetchLeaves(); // Refresh the list after updating
            } catch (err) {
                console.error("Failed to update status:", err);
                Swal.fire('Error', 'Could not update leave status.', 'error');
            }
        }
    };

    const filteredLeaves = leaves.filter((leave) =>
        (leave.employeeId?.employeeId?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (leave.leaveType?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const pendingCount = leaves.filter(l => l.status === 'Pending').length;
    const approvedCount = leaves.filter(l => l.status === 'Approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header title="Leave Management" />
                <main className="flex-1 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={<FiClock size={22} className="text-yellow-600"/>} label="Pending Requests" value={pendingCount} color="bg-yellow-100 dark:bg-yellow-900/50" />
                        <StatCard icon={<FiCheckCircle size={22} className="text-green-600"/>} label="Approved Leaves" value={approvedCount} color="bg-green-100 dark:bg-green-900/50" />
                        <StatCard icon={<FiXCircle size={22} className="text-red-600"/>} label="Rejected Leaves" value={rejectedCount} color="bg-red-100 dark:bg-red-900/50" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search by Employee ID or Leave Type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full md:w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-4 font-semibold">Employee</th>
                                        <th className="p-4 font-semibold">Leave Type</th>
                                        <th className="p-4 font-semibold">Dates</th>
                                        <th className="p-4 font-semibold text-center">Status</th>
                                        <th className="p-4 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredLeaves.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="p-4">
                                                <div className="font-medium dark:text-white">{leave.employeeId?.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{leave.employeeId?.employeeId}</div>
                                            </td>
                                            <td className="p-4">{leave.leaveType}</td>
                                            <td className="p-4">{new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}</td>
                                            <td className="p-4 text-center"><LeaveStatusBadge status={leave.status} /></td>
                                            <td className="p-4 text-center space-x-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                    disabled={leave.status !== 'Pending'}
                                                    className="px-3 py-1 text-xs font-semibold rounded-md bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                    disabled={leave.status !== 'Pending'}
                                                    className="px-3 py-1 text-xs font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LeavesDashboard;