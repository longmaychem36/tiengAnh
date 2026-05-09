import axiosClient from './axiosClient';

export const collectionApi = {
  getMyCollections: () => axiosClient.get('/collections'),
  createCollection: (data) => axiosClient.post('/collections', data),
  deleteCollection: (id) => axiosClient.delete(`/collections/${id}`),
  
  getWords: (collectionId) => axiosClient.get(`/collections/${collectionId}/words`),
  addWord: (collectionId, data) => axiosClient.post(`/collections/${collectionId}/words`, data),
  removeWord: (collectionId, wordId) => axiosClient.delete(`/collections/${collectionId}/words/${wordId}`)
};
