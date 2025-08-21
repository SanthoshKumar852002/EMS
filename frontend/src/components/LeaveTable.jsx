import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LeaveTable = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leavesPerPage = 5;

  const [counts, setCounts] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('/api/leaves');
      const filtered = res.data.filter((leave) =>
        leave.employeeId.toLowerCase().includes(search.toLowerCase())
      );

      setLeaves(filtered);

      // Update counts
      const approved = filtered.filter((l) => l.status === 'Approved').length;
      const rejected = filtered.filter((l) => l.status === 'Rejected').length;
      const pending = filtered.filter((l) => l.status === 'Pending').length;

      setCounts({ approved, rejected, pending });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`/api/leaves/${id}/status`, { status });

      Swal.fire(`Leave ${status}`, '', 'success');
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [search]);

  // Pagination logic
  const indexOfLast = currentPage * leavesPerPage;
  const indexOfFirst = indexOfLast - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(leaves.length / leavesPerPage);

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <div className="flex gap-4">
          <span className="text-green-600">Approved: {counts.approved}</span>
          <span className="text-red-600">Rejected: {counts.rejected}</span>
          <span className="text-yellow-600">Pending: {counts.pending}</span>
        </div>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">S.No</th>
            <th className="p-2">Employee ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">From</th>
            <th className="p-2">To</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentLeaves.map((leave, index) => (
            <tr key={leave._id} className="border-t">
              <td className="p-2 text-center">{indexOfFirst + index + 1}</td>
              <td className="p-2">{leave.employeeId}</td>
              <td className="p-2">{leave.name}</td>
              <td className="p-2">{leave.type}</td>
              <td className="p-2">{leave.from}</td>
              <td className="p-2">{leave.to}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    leave.status === 'Approved'
                      ? 'bg-green-500'
                      : leave.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {leave.status}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleStatusChange(leave._id, 'Approved')}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(leave._id, 'Rejected')}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeaveTable;
