// 📁 C:/EMS/frontend/src/pages/SalaryDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SalaryForm from '../components/salaryForm.jsx'; // Make sure file is named SalaryForm.jsx (capital S)

const SalaryDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [editingSalary, setEditingSalary] = useState(null);


  // 💰 Fetch salary records from MongoDB
  const fetchSalaries = async () => {
    try {
      const res = await axios.get('/api/salaries');
      setSalaries(res.data);
    } catch (err) {
      console.error('சம்பள தகவல்களை கொண்டு வர முடியவில்லை:', err);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Header title="💰 Salary Dashboard" />

        {/* 💵 Salary Add Form */}
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">➕ Add Salary</h2>
          <SalaryForm onSalaryAdded={fetchSalaries} />
        </div>

        {/* 💼 Salary History Table */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">📊 Salary History</h2>

          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Salary</th>
                <th className="p-2 border">Allowance</th>
                <th className="p-2 border">Deduction</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((item, index) => (
                <tr key={item._id} className="text-center hover:bg-gray-100">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    {item.employeeId?.name || 'N/A'}<br />
                    <span className="text-xs text-gray-500">
                      ({item.employeeId?.employeeId || 'N/A'})
                    </span>
                  </td>
                  <td className="p-2 border">₹{item.salary}</td>
                  <td className="p-2 border">₹{item.allowance}</td>
                  <td className="p-2 border text-red-500">₹{item.deduction}</td>
                  <td className="p-2 border font-bold text-green-600">₹{item.total}</td>
                  <td className="p-2 border">
                    {item.payDate ? new Date(item.payDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 👇 No records UI */}
          {salaries.length === 0 && (
            <p className="text-center text-gray-500 mt-4">😕 சம்பள பதிவுகள் எதுவும் இல்லை.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryDashboard;
