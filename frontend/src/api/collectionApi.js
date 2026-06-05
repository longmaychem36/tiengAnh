import axiosClient from './axiosClient';

export const collectionApi = {
  getMyCollections: () => axiosClient.get('/collections'),
  getPublicCollections: () => axiosClient.get('/collections/public'),
  createCollection: (data) => axiosClient.post('/collections', data),
  updateCollection: (id, data) => axiosClient.put(`/collections/${id}`, data),
  deleteCollection: (id) => axiosClient.delete(`/collections/${id}`),
  
  getWords: (collectionId) => axiosClient.get(`/collections/${collectionId}/words`),
  addWord: (collectionId, data) => axiosClient.post(`/collections/${collectionId}/words`, data),
  updateWord: (collectionId, wordId, data) => axiosClient.put(`/collections/${collectionId}/words/${wordId}`, data),
  removeWord: (collectionId, wordId) => axiosClient.delete(`/collections/${collectionId}/words/${wordId}`)
};
