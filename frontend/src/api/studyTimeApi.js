import axiosClient from './axiosClient';
import { API_URL } from './config';

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
