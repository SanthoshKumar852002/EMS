import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Swal from 'sweetalert2';

const DepartmentsDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [editingDept, setEditingDept] = useState(null);

  const token = localStorage.getItem('token');

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `/api/departments?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(res.data.data);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line
  }, [search, sort, order, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await axios.put(
          `/api/departments/${editingDept._id}`,
          { name, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire('Updated!', 'Department updated successfully!', 'success');
      } else {
        await axios.post(
          '/api/departments',
          { name, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire('Added!', 'Department added successfully!', 'success');
      }
      setName('');
      setDescription('');
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      Swal.fire('Error', 'Could not save department', 'error');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/departments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire('Deleted!', 'Department deleted.', 'success');
        fetchDepartments();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  const handleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Header title="Departments Dashboard" />
        <div className="mb-4">
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
            <input
              type="text"
              placeholder="Department Name"
              className="border p-2 mr-2 w-1/3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 mr-2 w-1/3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              {editingDept ? 'Update' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search departments"
              className="border p-2 w-1/3"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <div className="text-sm">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-2 py-1 border rounded mr-2"
              >
                Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-2 py-1 border rounded ml-2"
              >
                Next
              </button>
            </div>
          </div>

          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                  Name {sort === 'name' ? (order === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('description')}>
                  Description {sort === 'description' ? (order === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept._id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2">{dept.name}</td>
                    <td className="px-4 py-2">{dept.description}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="bg-yellow-400 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsDashboard;
