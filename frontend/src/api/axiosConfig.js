import axios from 'axios';

// Create and configure a new Axios instance.
// This centralizes your API configuration so you don't have to repeat it in every file.
const apiClient = axios.create({
  // Use the '/api' prefix, which will be handled by your Vite proxy
  // to redirect requests to your backend server (e.g., http://localhost:5000).
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the configured instance to be used by your other API files.
export default apiClient;