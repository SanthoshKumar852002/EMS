import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

export const fetchEmployees = () => axios.get(API_URL);

export const createEmployee = (formData) =>
  axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);

export const updateEmployee = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
