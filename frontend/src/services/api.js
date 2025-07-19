import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  } catch (error) {
    console.error("Could not parse user info from localStorage", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;