import axios from 'axios';

// Create an instance of axios without setting a default baseURL
const axiosInstance = axios.create({
 
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ad_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type for non-multipart/form-data requests
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
