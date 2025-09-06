// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddAdminForm from '../components/AddAdminForm'; // Import the new form

const Dashboard = () => {
  const [counts, setCounts] = useState({ employees: 0, departments: 0, salaryPaid: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch counts and employees in parallel
        const [countsRes, employeesRes] = await Promise.all([
          axios.get('/api/dashboard/counts'), 
          axios.get('/api/employees')
        ]);
        setCounts(countsRes.data);
        setEmployees(employeesRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* --- Data Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-200 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-4xl font-bold">{counts.employees}</p>
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Departments</h3>
          <p className="text-4xl font-bold">{counts.departments}</p>
        </div>
        <div className="bg-yellow-200 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Monthly Salary Paid</h3>
          <p className="text-4xl font-bold">₹{counts.salaryPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* --- Add Admin Form & Employee List --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddAdminForm />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Employee List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 10).map((emp) => ( // Show first 10 employees
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{emp.name}</td>
                    <td className="p-3">{emp.employeeId}</td>
                    <td className="p-3 text-gray-600">{emp.email}</td>
                    <td className="p-3">{emp.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && <p className="text-center p-4">No employees found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;