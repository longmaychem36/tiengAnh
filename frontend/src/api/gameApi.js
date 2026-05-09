import axiosClient from './axiosClient';

export const gameApi = {
  getSets: () => axiosClient.get('/games/sets'),
  getLevels: (setId) => axiosClient.get(`/games/sets/${setId}/levels`),
  getQuestions: (levelId) => axiosClient.get(`/games/levels/${levelId}/questions`),
  submit: (data) => axiosClient.post('/games/submit', data),
  transcribeAudio: (formData) => axiosClient.post('/speaking/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
