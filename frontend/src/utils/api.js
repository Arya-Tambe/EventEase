import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add token to every request automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;