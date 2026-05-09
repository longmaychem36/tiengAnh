import axiosClient from './axiosClient';

export const lessonApi = {
  getAll: (params) => axiosClient.get('/lessons', { params }),
  getByCourse: (courseId) => axiosClient.get(`/lessons/course/${courseId}`),
  getById: (id) => axiosClient.get(`/lessons/${id}`),
  create: (data) => axiosClient.post('/lessons', data),
  update: (id, data) => axiosClient.put(`/lessons/${id}`, data),
  remove: (id) => axiosClient.delete(`/lessons/${id}`),
  addMedia: (id, data) => axiosClient.post(`/lessons/${id}/media`, data),
  removeMedia: (mediaId) => axiosClient.delete(`/lessons/media/${mediaId}`)
};
