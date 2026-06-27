import axiosClient from './axiosClient';

export const notificationApi = {
  listMine: (params) => axiosClient.get('/notifications', { params }),
  markRead: (recipientId) => axiosClient.put(`/notifications/${recipientId}/read`),
  markAllRead: () => axiosClient.put('/notifications/read-all')
};

export const adminNotificationApi = {
  list: (params) => axiosClient.get('/admin/notifications', { params }),
  create: (data) => axiosClient.post('/admin/notifications', data)
};
