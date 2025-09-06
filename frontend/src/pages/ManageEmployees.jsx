import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiPlus, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // <-- State for departments
  const [formData, setFormData] = useState({
    name: '', employeeId: '', email: '', password: '', gender: '', dob: '',
    department: '', designation: '', salary: '', image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);

  // ✅ Fetch both employees and departments when the component loads
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/employees', config);
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      Swal.fire('Error', 'Could not fetch employee data.', 'error');
    }
  };

  // ✅ New function to fetch the list of departments
  const fetchDepartments = async () => {
    try {
        const token = localStorage.getItem('adminToken'); // Or your relevant token
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/departments', config);
        // Assuming the API returns an object with a 'data' array
        if (res.data && res.data.data) {
          setDepartments(res.data.data);
        }
    } catch (error) {
        console.error("Failed to fetch departments", error);
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

  const resetForm = () => {
    setFormData({
      name: '', employeeId: '', email: '', password: '', gender: '', dob: '',
      department: '', designation: '', salary: '', image: null,
    });
    setEditMode(false);
    setSelectedId(null);
    setPreview('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => formPayload.append(key, value));
    
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
      resetForm();
      setShowFormModal(false);
      fetchEmployees();
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred.';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditMode(false);
    setShowFormModal(true);
  };
  
  const handleEdit = (emp) => {
    setEditMode(true);
    setSelectedId(emp._id);
    setFormData({ ...emp, password: '', image: null });
    setPreview(emp.imageUrl || `http://localhost:5000/uploads/${emp.image}`);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?', text: 'This action cannot be undone!',
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33', cancelButtonColor: '#3085d6'
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/employees/${id}`, config);
      fetchEmployees();
      Swal.fire('Deleted!', 'The employee has been removed.', 'success');
    }
  };

  const filteredEmployees = filterDept
    ? employees.filter((emp) => emp.department === filterDept)
    : employees;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Employee Directory" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-500" />
              {/* ✅ Dynamically populated filter dropdown */}
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm">
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <FiPlus /> Add Employee
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                 {/* Table Head */}
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 font-semibold">Employee</th>
                    <th className="p-4 font-semibold">Employee ID</th>
                    <th className="p-4 font-semibold">Department</th>
                    <th className="p-4 font-semibold">Date of Birth</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                 {/* Table Body */}
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={`http://localhost:5000/uploads/${emp.image}`} alt={emp.name} className="w-10 h-10 rounded-full object-cover"/>
                        <span className="font-medium dark:text-white">{emp.name}</span>
                      </td>
                      <td className="p-4">{emp.employeeId}</td>
                      <td className="p-4">{emp.department}</td>
                      <td className="p-4">{new Date(emp.dob).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleEdit(emp)} className="text-blue-500 hover:text-blue-700 p-2"><FiEdit size={18} /></button>
                        <button onClick={() => handleDelete(emp._id)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{editMode ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form fields... */}
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Login Email" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password (leave blank to keep)" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />

              {/* ✅ Dynamically populated department dropdown in the form */}
              <select name="department" value={formData.department} onChange={handleChange} required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                ))}
              </select>

              <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <input name="image" type="file" accept="image/*" onChange={handleChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 md:col-span-2" />
              
              {preview && <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded border" />}
              
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{editMode ? 'Save Changes' : 'Add Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;