import axiosClient from './axiosClient';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => axiosClient.get('/admin/dashboard/stats'),

  // Game Levels
  getLevels: () => axiosClient.get('/admin/games/levels'),
  createLevel: (data) => axiosClient.post('/admin/games/levels', data),
  updateLevel: (id, data) => axiosClient.put(`/admin/games/levels/${id}`, data),
  deleteLevel: (id) => axiosClient.delete(`/admin/games/levels/${id}`),

  // Game Questions
  getQuestions: (levelId) => axiosClient.get(`/admin/games/levels/${levelId}/questions`),
  createQuestion: (data) => axiosClient.post('/admin/games/questions', data),
  updateQuestion: (id, data) => axiosClient.put(`/admin/games/questions/${id}`, data),
  deleteQuestion: (id) => axiosClient.delete(`/admin/games/questions/${id}`),

  // Placement test questions
  getPlacementMiniGameQuestions: () => axiosClient.get('/admin/placement/minigame-questions'),
  createPlacementMiniGameQuestion: (data) => axiosClient.post('/admin/placement/minigame-questions', data),
  updatePlacementMiniGameQuestion: (id, data) => axiosClient.put(`/admin/placement/minigame-questions/${id}`, data),
  deletePlacementMiniGameQuestion: (id) => axiosClient.delete(`/admin/placement/minigame-questions/${id}`),

  // Users
  createUser: (data) => axiosClient.post('/admin/users', data),
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  getUserStats: () => axiosClient.get('/admin/users/stats'),
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),
  giftPlusDays: (id, days) => axiosClient.put(`/admin/users/${id}/plus-days`, { days }),
  resetUserPassword: (id, password) => axiosClient.put(`/admin/users/${id}/password`, { password }),
  toggleUserActive: (id) => axiosClient.put(`/admin/users/${id}/toggle-active`),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

  // Vocabulary public collections
  getVocabularyCollections: (status = 'all', source = 'all') => axiosClient.get('/admin/vocabulary/collections', { params: { status, source } }),
  createVocabularyCollection: (data) => axiosClient.post('/admin/vocabulary/collections', data),
  updateVocabularyCollection: (id, data) => axiosClient.put(`/admin/vocabulary/collections/${id}`, data),
  reviewVocabularyCollection: (id, status) => axiosClient.put(`/admin/vocabulary/collections/${id}/review`, { status }),
  deleteVocabularyCollection: (id) => axiosClient.delete(`/admin/vocabulary/collections/${id}`),
  getVocabularyWords: (collectionId) => axiosClient.get(`/admin/vocabulary/collections/${collectionId}/words`),
  createVocabularyWord: (collectionId, data) => axiosClient.post(`/admin/vocabulary/collections/${collectionId}/words`, data),
  updateVocabularyWord: (wordId, data) => axiosClient.put(`/admin/vocabulary/words/${wordId}`, data),
  deleteVocabularyWord: (wordId) => axiosClient.delete(`/admin/vocabulary/words/${wordId}`),
};
