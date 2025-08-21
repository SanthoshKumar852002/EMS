// 📁 C:/EMS/frontend/src/components/SalaryForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SalaryForm = ({ onSalaryAdded }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    salary: '',
    allowance: '',
    deduction: '',
    payDate: '',
  });

  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { salary, allowance, deduction } = formData;
    const total = parseFloat(salary) + parseFloat(allowance) - parseFloat(deduction);

    try {
      await axios.post('/api/salaries', { ...formData, total });
      Swal.fire('✅ Success', 'Salary record added!', 'success');
      setFormData({
        employeeId: '',
        salary: '',
        allowance: '',
        deduction: '',
        payDate: '',
      });
      onSalaryAdded();
    } catch (err) {
      console.error('❌ Failed to add salary:', err);
      Swal.fire('❌ Error', 'Failed to add salary', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Select Employee</label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">-- Select --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Allowance</label>
          <input
            type="number"
            name="allowance"
            value={formData.allowance}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Deduction</label>
          <input
            type="number"
            name="deduction"
            value={formData.deduction}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Pay Date</label>
        <input
          type="date"
          name="payDate"
          value={formData.payDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        💾 Add Salary
      </button>
    </form>
  );
};

export default SalaryForm;
