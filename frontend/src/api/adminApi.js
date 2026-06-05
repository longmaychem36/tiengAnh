import axiosClient from './axiosClient';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => axiosClient.get('/admin/dashboard/stats'),

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

  // Vocabulary public collections
  getVocabularyCollections: (status = 'all') => axiosClient.get('/admin/vocabulary/collections', { params: { status } }),
  createVocabularyCollection: (data) => axiosClient.post('/admin/vocabulary/collections', data),
  updateVocabularyCollection: (id, data) => axiosClient.put(`/admin/vocabulary/collections/${id}`, data),
  reviewVocabularyCollection: (id, status) => axiosClient.put(`/admin/vocabulary/collections/${id}/review`, { status }),
  deleteVocabularyCollection: (id) => axiosClient.delete(`/admin/vocabulary/collections/${id}`),
  getVocabularyWords: (collectionId) => axiosClient.get(`/admin/vocabulary/collections/${collectionId}/words`),
  createVocabularyWord: (collectionId, data) => axiosClient.post(`/admin/vocabulary/collections/${collectionId}/words`, data),
  updateVocabularyWord: (wordId, data) => axiosClient.put(`/admin/vocabulary/words/${wordId}`, data),
  deleteVocabularyWord: (wordId) => axiosClient.delete(`/admin/vocabulary/words/${wordId}`),
};
