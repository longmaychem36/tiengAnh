import axiosClient from './axiosClient';

export const dictionaryApi = {
  search: (params) => axiosClient.get('/dictionary/search', { params }),
  getById: (id) => axiosClient.get(`/dictionary/${id}`),
  getHistory: () => axiosClient.get('/dictionary/history/me'),
  create: (data) => axiosClient.post('/dictionary', data),
  autocomplete: (params) => axiosClient.get('/dictionary/autocomplete', { params }),
  translate: (data) => axiosClient.post('/dictionary/translate', data)
};
