import axiosClient from './axiosClient';

export const userApi = {
  getAll: (params) => axiosClient.get('/users', { params }),
  getById: (id) => axiosClient.get(`/users/${id}`),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  updateAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosClient.put(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000
    });
  },
  getStats: (id) => axiosClient.get(`/users/${id}/stats`)
};
