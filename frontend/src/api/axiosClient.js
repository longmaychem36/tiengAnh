// ============================================
// Axios Client — HTTP Instance + Interceptors
// ============================================
import axios from 'axios';
import { stopAllPlayback } from '../utils/audioControl';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user:v1';
const LEGACY_USER_STORAGE_KEY = 'user';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor — attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      stopAllPlayback();
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
