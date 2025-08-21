import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    gender: '',
    dob: '',
    department: '',
    designation: '',
    salary: '',
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState('');
  const [filterDept, setFilterDept] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get('http://localhost:5000/api/employees');
    setEmployees(res.data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => formPayload.append(key, value));

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/employees/${selectedId}`, formPayload);
        Swal.fire('Updated!', 'Employee details updated.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/employees', formPayload);
        Swal.fire('Added!', 'New employee added.', 'success');
      }
      setFormData({
        name: '',
        employeeId: '',
        gender: '',
        dob: '',
        department: '',
        designation: '',
        salary: '',
        image: null,
      });
      setEditMode(false);
      setSelectedId(null);
      setPreview('');
      fetchEmployees();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleEdit = (emp) => {
    setFormData({ ...emp, image: null });
    setEditMode(true);
    setSelectedId(emp._id);
    setPreview(emp.imageUrl);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Employee will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
    });
    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
      Swal.fire('Deleted!', 'Employee removed.', 'success');
    }
  };

  const filteredEmployees = filterDept
    ? employees.filter((emp) => emp.department === filterDept)
    : employees;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="👥 Employee Dashboard" subtitle="Manage employees in real-time" />

        {/* Filter & Toggle Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="">Filter by Department</option>
            <option value="HR">HR</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
          </select>

          <button
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
            onClick={() =>
              Swal.fire('Coming Soon!', 'Salary history tab will be available soon.', 'info')
            }
          >
            💰 View Salary History
          </button>
        </div>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md"
        >
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="border p-2 rounded" />
          <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border p-2 rounded" />
          <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="border p-2 rounded" />
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="border p-2 rounded" />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" required className="border p-2 rounded" />
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="border p-2 rounded" />
          <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary" required className="border p-2 rounded" />
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="border p-2 rounded" />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded border" />}
          <button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            {editMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>

        {/* Employee Table */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">📋 Employee List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow-md">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">DOB</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b text-center">
                    <td className="p-2">
                      <img src={emp.imageUrl} alt="Employee" className="w-12 h-12 rounded-full mx-auto" />
                    </td>
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.dob}</td>
                    <td className="p-2">{emp.department}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(emp)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(emp._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

