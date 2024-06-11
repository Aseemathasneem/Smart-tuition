import axios from 'axios';

// Create an instance of axios without baseURL
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Common API function
export const apiCall = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
