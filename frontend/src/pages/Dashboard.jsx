import React, { useEffect, useState } from 'react';
import { getDashboardCounts } from '../api/dashboardApi.js';

const Dashboard = () => {
  // State to hold the counts, initialized to 0
  const [counts, setCounts] = useState({
    employees: 0,
    departments: 0,
    leaves: 0,
    salaryPaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardCounts();
        setCounts(data); // Update state with the fetched data
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // The empty array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees Card */}
        <div className="bg-blue-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-3xl font-bold">{counts.employees}</p>
        </div>

        {/* Departments Card */}
        <div className="bg-green-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Departments</h3>
          <p className="text-3xl font-bold">{counts.departments}</p>
        </div>

        {/* Total Leaves Card */}
        <div className="bg-purple-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Leaves</h3>
          <p className="text-3xl font-bold">{counts.leaves}</p>
        </div>

        {/* Monthly Pay Card */}
        <div className="bg-yellow-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Monthly Pay</h3>
          <p className="text-3xl font-bold">₹ {counts.salaryPaid.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
