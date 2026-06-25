import axiosClient from './axiosClient';

export const collectionApi = {
  getMyCollections: () => axiosClient.get('/collections'),
  getPublicCollections: () => axiosClient.get('/collections/public'),
  getMyPublicSubmissions: () => axiosClient.get('/collections/submissions'),
  createCollection: (data) => axiosClient.post('/collections', data),
  updateCollection: (id, data) => axiosClient.put(`/collections/${id}`, data),
  deleteCollection: (id) => axiosClient.delete(`/collections/${id}`),
  createPublicSubmission: (data) => axiosClient.post('/collections/submissions', data),
  updatePublicSubmission: (id, data) => axiosClient.put(`/collections/submissions/${id}`, data),
  submitPublicSubmission: (id) => axiosClient.post(`/collections/submissions/${id}/submit`),
  deletePublicSubmission: (id) => axiosClient.delete(`/collections/submissions/${id}`),
  
  getWords: (collectionId) => axiosClient.get(`/collections/${collectionId}/words`),
  addWord: (collectionId, data) => axiosClient.post(`/collections/${collectionId}/words`, data),
  updateWord: (collectionId, wordId, data) => axiosClient.put(`/collections/${collectionId}/words/${wordId}`, data),
  removeWord: (collectionId, wordId) => axiosClient.delete(`/collections/${collectionId}/words/${wordId}`)
};
