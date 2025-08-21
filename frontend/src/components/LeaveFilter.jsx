import React from 'react';

const LeaveFilter = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by ID or Type"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-4 py-2 rounded w-full shadow-sm"
    />
  );
};

export default LeaveFilter;
