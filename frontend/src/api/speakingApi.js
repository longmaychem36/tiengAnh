import axiosClient from './axiosClient';

export const speakingApi = {
  getLessons: () => axiosClient.get('/speaking/lessons'),
  
  getLessonDetails: (id) => axiosClient.get(`/speaking/lessons/${id}`),
  
  transcribeAudio: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return axiosClient.post('/speaking/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000
    });
  },

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
  
  analyzeText: (data) => axiosClient.post('/speaking/analyze', data),
  
  saveProgress: (data) => axiosClient.post('/speaking/progress', data),

  generatePersonalizedLesson: (data) => axiosClient.post('/speaking/personalized', data, {
    timeout: 60000
  }),

  analyzePersonalizedTurn: (sessionId, { audioBlob, stateToken, history, option, passThreshold }) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('stateToken', stateToken);
    formData.append('history', JSON.stringify(history));
    formData.append('option', JSON.stringify(option));
    formData.append('passThreshold', String(passThreshold));
    return axiosClient.post(`/speaking/personalized/${sessionId}/analyze-turn`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 50000
    });
  },

  generateNextPersonalizedTurn: (sessionId, data) => axiosClient.post(
    `/speaking/personalized/${sessionId}/next-turn`,
    data,
    { timeout: 60000 }
  )
};
