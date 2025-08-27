import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  // ✅ ADD EMAIL AND PASSWORD TO THE INITIAL STATE
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',      // Added for login
      // Added for login
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
    try {
        // You should include the admin token for protected routes
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/employees', config);
        setEmployees(res.data);
    } catch (error) {
        console.error("Failed to fetch employees", error);
        Swal.fire('Error', 'Could not fetch employee data.', 'error');
    }
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
    
    // Include the admin token for authorization
    const token = localStorage.getItem('adminToken');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/employees/${selectedId}`, formPayload, config);
        Swal.fire('Updated!', 'Employee details updated.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/employees', formPayload, config);
        Swal.fire('Added!', 'New employee added.', 'success');
      }
      // Reset form fully
      setFormData({
        name: '', employeeId: '', email: '', password: '', gender: '', dob: '',
        department: '', designation: '', salary: '', image: null,
      });
      setEditMode(false);
      setSelectedId(null);
      setPreview('');
      fetchEmployees();
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred.';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleEdit = (emp) => {
    setFormData({
        ...emp,
        email: emp.email || '', // Ensure email is populated for editing
        password: '', // Don't show existing password
        image: null
    });
    setEditMode(true);
    setSelectedId(emp._id);
    setPreview(emp.imageUrl);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?', text: 'Employee will be deleted!',
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!',
    });
    if (confirm.isConfirmed) {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/employees/${id}`, config);
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

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border rounded px-4 py-2">
            <option value="">Filter by Department</option>
            <option value="HR">HR</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
          </select>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="border p-2 rounded" />
          <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border p-2 rounded" />
          {/* ✅ ADD EMAIL AND PASSWORD INPUTS */}
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Login Email" required className="border p-2 rounded" />
         
          <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="border p-2 rounded" />
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="border p-2 rounded" />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" required className="border p-2 rounded" />
          <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="border p-2 rounded" />
          <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary" required className="border p-2 rounded" />
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="border p-2 rounded" />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded border" />}
          <button type="submit" className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
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
                    <td className="p-2"><img src={`http://localhost:5000/uploads/${emp.image}`} alt={emp.name} className="w-12 h-12 rounded-full mx-auto object-cover" /></td>
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{new Date(emp.dob).toLocaleDateString()}</td>
                    <td className="p-2">{emp.department}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(emp)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(emp._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr><td colSpan="5" className="p-4 text-center text-gray-500">No employees found</td></tr>
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