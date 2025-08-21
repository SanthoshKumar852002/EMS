import axios from 'axios';

export const fetchLeaves = (search) =>
  axios.get(`/api/leaves?search=${search}`);

export const updateStatus = (id, status) =>
  axios.put(`/api/leaves/status/${id}`, { status });
