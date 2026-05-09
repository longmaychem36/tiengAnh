import axiosClient from './axiosClient';

export const adminApi = {
  // Game Sets
  createSet: (data) => axiosClient.post('/admin/games/sets', data),
  updateSet: (id, data) => axiosClient.put(`/admin/games/sets/${id}`, data),
  deleteSet: (id) => axiosClient.delete(`/admin/games/sets/${id}`),

  // Game Levels
  createLevel: (data) => axiosClient.post('/admin/games/levels', data),
  updateLevel: (id, data) => axiosClient.put(`/admin/games/levels/${id}`, data),
  deleteLevel: (id) => axiosClient.delete(`/admin/games/levels/${id}`),

  // Game Questions
  getQuestions: (levelId) => axiosClient.get(`/admin/games/levels/${levelId}/questions`),
  createQuestion: (data) => axiosClient.post('/admin/games/questions', data),
  updateQuestion: (id, data) => axiosClient.put(`/admin/games/questions/${id}`, data),
  deleteQuestion: (id) => axiosClient.delete(`/admin/games/questions/${id}`),

  // Users (SuperAdmin)
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  getUserStats: () => axiosClient.get('/admin/users/stats'),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  toggleUserActive: (id) => axiosClient.put(`/admin/users/${id}/toggle-active`),
};
