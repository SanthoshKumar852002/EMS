import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DepartmentsDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/departments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await axios.put(`/api/departments/${editingDept._id}`, { name, description }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire('Updated!', 'Department updated successfully!', 'success');
      } else {
        await axios.post('/api/departments', { name, description }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire('Added!', 'Department added successfully!', 'success');
      }
      resetForm();
      fetchDepartments();
    } catch (err) {
      Swal.fire('Error', 'Could not save department', 'error');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingDept(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?', text: "You won't be able to revert this!",
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/departments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire('Deleted!', 'Department deleted.', 'success');
        fetchDepartments();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Departments" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Manage Departments</h2>
            <button onClick={handleAddNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <FiPlus /> Add Department
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 font-semibold">Department Name</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {departments.map((dept) => (
                    <tr key={dept._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-4 font-medium dark:text-white">{dept.name}</td>
                      <td className="p-4">{dept.description}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleEdit(dept)} className="text-blue-500 hover:text-blue-700 p-2"><FiEdit size={18} /></button>
                        <button onClick={() => handleDelete(dept._id)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{editingDept ? 'Edit Department' : 'Add New Department'}</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Department Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700" />
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700" rows="3"></textarea>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{editingDept ? 'Save Changes' : 'Add Department'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DepartmentsDashboard;