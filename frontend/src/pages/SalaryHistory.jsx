import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To get the logged-in user

const SalaryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user data from your authentication context

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      // Make sure we have a user and their ID before fetching
      if (!user?._id) {
        setLoading(false);
        setError("Could not identify the logged-in user.");
        return;
      }

      try {
        const token = localStorage.getItem('employeeToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        
        // Call the new backend endpoint with the user's ID
        const res = await axios.get(`/api/salaries/employee/${user._id}`, config);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch salary history:', err);
        setError('Could not load salary history.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryHistory();
  }, [user]); // Re-run the effect if the user object changes

  if (loading) {
    return <p className="text-center text-gray-500">Loading salary history...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Salary History</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">You do not have any salary records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 border">Pay Date</th>
                <th className="p-3 border">Base Salary</th>
                <th className="p-3 border">Allowance</th>
                <th className="p-3 border">Deduction</th>
                <th className="p-3 border font-semibold">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 border">{new Date(item.payDate).toLocaleDateString()}</td>
                  <td className="p-3 border">₹{item.salary.toLocaleString()}</td>
                  <td className="p-3 border">₹{item.allowance.toLocaleString()}</td>
                  <td className="p-3 border text-red-500">₹{item.deduction.toLocaleString()}</td>
                  <td className="p-3 border font-bold text-green-600">₹{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryHistory;