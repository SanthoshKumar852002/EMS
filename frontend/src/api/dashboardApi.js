import apiClient from './axiosConfig.js';

/**
 * Fetches the aggregated counts for the main dashboard from a single endpoint.
 * @returns {Promise<Object>} A promise that resolves to an object with counts 
 * (e.g., { employees: 10, departments: 4, salaryPaid: 50000 }).
 */

// export const getLeaveCount = () => apiClient.get('/leaves/count');
// export const getDepartmentCount = () => apiClient.get('/departments/count');
// export const getEmployeeCount = () => apiClient.get('/employees/count');
// export const getTotalSalary = () => apiClient.get('/salaries/total');
export const getDashboardCounts = async () => {
  try {
    const response = await apiClient.get('/dashboard/counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard counts:',    error);
    throw error;
  }
};