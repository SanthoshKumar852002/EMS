// src/components/LeaveStatusButton.jsx
import React from 'react';
import Swal from 'sweetalert2';

const LeaveStatusButton = ({ id, onStatusChange, currentStatus }) => {
  const handleClick = (status) => {
    Swal.fire({
      title: `Are you sure to ${status}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
    }).then((result) => {
      if (result.isConfirmed) {
        onStatusChange(id, status);
        Swal.fire('Updated!', `Leave marked as ${status}`, 'success');
      }
    });
  };

  return (
    <div className="space-x-2">
      <button
        onClick={() => handleClick('Approved')}
        disabled={currentStatus === 'Approved'}
        className="bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleClick('Rejected')}
        disabled={currentStatus === 'Rejected'}
        className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
};

export default LeaveStatusButton;
