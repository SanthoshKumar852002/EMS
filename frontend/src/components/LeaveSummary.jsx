import React, { useEffect, useState } from 'react';
// 👇 Corrected: Import only the single function from the correct file
import { getDashboardCounts } from '../api/dashboardApi.js'; 

const OverviewCards = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    leaves: 0,
    salaryPaid: 0,
  });

  const fetchData = async () => {
    try {
      // 👇 Corrected: Call the single, efficient dashboard API function
      const data = await getDashboardCounts();

      // Update the state with the data received from the single API call
      setStats({
        employees: data.employees || 0,
        departments: data.departments || 0,
        leaves: data.leaves || 0,
        salaryPaid: data.salaryPaid || 0,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // ⏱️ Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const cardStyle =
    'bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center transition transform hover:scale-105 duration-300';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className={cardStyle}>
        <h2 className="text-2xl font-bold">{stats.employees}</h2>
        <p>Total Employees</p>
      </div>
      <div className={cardStyle}>
        <h2 className="text-2xl font-bold">{stats.departments}</h2>
        <p>Total Departments</p>
      </div>
      <div className={cardStyle}>
        <h2 className="text-2xl font-bold">{stats.leaves}</h2>
        <p>Total Leaves</p>
      </div>
      <div className={cardStyle}>
        <h2 className="text-2xl font-bold">₹{stats.salaryPaid.toLocaleString()}</h2>
        <p>Total Salary Paid</p>
      </div>
    </div>
  );
};

export default OverviewCards;