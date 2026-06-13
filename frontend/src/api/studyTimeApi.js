import axiosClient from './axiosClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_STORAGE_KEY = 'token';

export const studyTimeApi = {
  heartbeat: (activeSeconds) => axiosClient.post('/study-time/heartbeat', { activeSeconds }),

  heartbeatKeepalive: (activeSeconds) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token || !Number.isFinite(Number(activeSeconds)) || Number(activeSeconds) <= 0) return;

    fetch(`${API_URL}/study-time/heartbeat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ activeSeconds }),
      keepalive: true
    }).catch(() => {});
  }
};
