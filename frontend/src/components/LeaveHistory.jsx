import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveHistory = ({ employeeId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`/api/leaves/history/${employeeId}`);
      setHistory(res.data);
    };

    if (employeeId) fetchHistory();
  }, [employeeId]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Leave History</h2>
      <ul className="bg-white shadow rounded p-4 text-sm space-y-2">
        {history.map((item, index) => (
          <li key={index} className="border-b pb-2">
            {item.leaveType} from {item.fromDate} to {item.toDate} – {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveHistory;
