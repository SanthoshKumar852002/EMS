import apiClient from './axiosConfig.js'; // Assuming you have a central axios config

/**
 * Applies for a new leave.
 * @param {object} leaveData - The data for the leave application.
 */
export const applyLeave = (leaveData) => {
  return apiClient.post('/leaves', leaveData);
};

/**
 * Fetches a list of leave applications, with an optional search query.
 * @param {string} search - The search term.
 */
export const fetchLeaves = (search = '') => {
  return apiClient.get(`/leaves?search=${search}`);
};

/**
 * Updates the status of a leave application.
 * @param {string} id - The ID of the leave application.
 * @param {string} status - The new status (e.g., 'Approved', 'Rejected').
 */
export const updateLeaveStatus = (id, status) => {
  return apiClient.put(`/leaves/status/${id}`, { status });
};
