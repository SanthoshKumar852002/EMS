import React, { useEffect, useState } from 'react';
// 👇 ADD THIS IMPORT
import { getDashboardCounts } from '../api/dashboardApi.js'; 

const OverviewCards = () => {
  const [data, setData] = useState({
    employees: 0,
    departments: 0,
    salaryPaid: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await getDashboardCounts();
        // Assuming the API function returns the data object directly
        setData(res); 
      } catch (err) {
        console.error('Error fetching dashboard counts', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="bg-blue-200 rounded-xl p-5 shadow-md">
        <h3 className="text-xl font-bold"> Total Employees</h3>
        <p className="text-3xl">{data.employees}</p>
      </div>
      <div className="bg-green-200 rounded-xl p-5 shadow-md">
        <h3 className="text-xl font-bold"> Departments</h3>
        <p className="text-3xl">{data.departments}</p>
      </div>
      <div className="bg-yellow-200 rounded-xl p-5 shadow-md">
        <h3 className="text-xl font-bold"> Monthly Pay</h3>
        <p className="text-3xl">₹ {data.salaryPaid.toLocaleString()}</p>
      </div>
    </>
  );
};

export default OverviewCards;