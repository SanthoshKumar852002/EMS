import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiPlus, FiDollarSign } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const SalaryDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    salary: '',
    allowance: '',
    deduction: '',
    payDate: '',
  });

  const fetchSalaries = async () => {
    try {
      const res = await axios.get('/api/salaries');
      setSalaries(res.data);
    } catch (err) {
      console.error('Failed to fetch salary data:', err);
      Swal.fire('Error', 'Could not fetch salary history.', 'error');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({ employeeId: '', salary: '', allowance: '', deduction: '', payDate: '' });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { salary, allowance, deduction } = formData;
    const total = parseFloat(salary || 0) + parseFloat(allowance || 0) - parseFloat(deduction || 0);

    try {
      await axios.post('/api/salaries', { ...formData, total });
      Swal.fire('Success!', 'Salary record added successfully.', 'success');
      resetForm();
      fetchSalaries(); // Refresh salary list
    } catch (err) {
      console.error('Failed to add salary:', err);
      Swal.fire('Error', 'Failed to add salary record.', 'error');
    }
  };

  const totalSalaryPaid = salaries.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Salary Dashboard" />

        <main className="flex-1 p-6 md:p-8">
          {/* Stat Card for Total Salary */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                <FiDollarSign size={24} className="text-green-600"/>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Salary Paid</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  ₹{totalSalaryPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Salary History</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <FiPlus />
              Add Salary Record
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 font-semibold">Employee</th>
                    <th className="p-4 font-semibold">Base Salary</th>
                    <th className="p-4 font-semibold">Allowance</th>
                    <th className="p-4 font-semibold">Deduction</th>
                    <th className="p-4 font-semibold">Total Paid</th>
                    <th className="p-4 font-semibold">Pay Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {salaries.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-4">
                        <div className="font-medium dark:text-white">{item.employeeId?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{item.employeeId?.employeeId || 'N/A'}</div>
                      </td>
                      <td className="p-4">₹{item.salary.toLocaleString()}</td>
                      <td className="p-4">₹{item.allowance.toLocaleString()}</td>
                      <td className="p-4 text-red-500">₹{item.deduction.toLocaleString()}</td>
                      <td className="p-4 font-bold text-green-600">₹{item.total.toLocaleString()}</td>
                      <td className="p-4">{new Date(item.payDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Salary Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Add New Salary Record</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 dark:text-gray-300">Select Employee</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required>
                  <option value="">-- Select --</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" name="salary" placeholder="Base Salary" value={formData.salary} onChange={handleChange} required className="p-2 border rounded dark:bg-gray-700" />
                <input type="number" name="allowance" placeholder="Allowance" value={formData.allowance} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700" />
                <input type="number" name="deduction" placeholder="Deduction" value={formData.deduction} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm mb-1 dark:text-gray-300">Pay Date</label>
                <input type="date" name="payDate" value={formData.payDate} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Add Record</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SalaryDashboard;