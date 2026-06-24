import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }, { timeout: 60000 }),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  getMe: () => axiosClient.get('/auth/me')
};
