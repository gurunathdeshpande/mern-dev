import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://student-feedback-backend.onrender.com/api'
    : 'http://localhost:5000/api');

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance; 