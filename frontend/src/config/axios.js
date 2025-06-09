import axios from 'axios';

// Remove /api from base URL since we'll add it in the interceptor
const baseURL = 'https://student-feedback-backend.onrender.com';

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add /api prefix to all requests
    if (!config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    
    // Add token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response received
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection and try again.'
      });
    } else {
      // Request setup error
      return Promise.reject({
        message: 'An error occurred while setting up the request.'
      });
    }
  }
);

export default instance; 