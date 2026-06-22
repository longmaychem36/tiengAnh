import axiosClient from './axiosClient';

export const gameApi = {
  getLevels: () => axiosClient.get('/games/levels'),
  getQuestions: (levelId) => axiosClient.get(`/games/levels/${levelId}/questions`),
  submit: (data) => axiosClient.post('/games/submit', data),
  transcribeAndAnalyze: (audioBlob, targetTexts, context = {}) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('targetTexts', JSON.stringify(targetTexts));
    Object.entries(context).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
    return axiosClient.post('/speaking/transcribe-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000
    });
  },
  transcribeAudio: (formData) => axiosClient.post('/speaking/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
