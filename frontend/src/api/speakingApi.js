import axiosClient from './axiosClient';

export const speakingApi = {
  getLessons: () => axiosClient.get('/speaking/lessons'),
  
  getLessonDetails: (id) => axiosClient.get(`/speaking/lessons/${id}`),
  
  transcribeAudio: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return axiosClient.post('/speaking/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    });
  },

  transcribeAndAnalyze: (audioBlob, targetTexts) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('targetTexts', JSON.stringify(targetTexts));
    return axiosClient.post('/speaking/transcribe-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    });
  },
  
  analyzeText: (data) => axiosClient.post('/speaking/analyze', data),
  
  saveProgress: (data) => axiosClient.post('/speaking/progress', data),

  generatePersonalizedLesson: (data) => axiosClient.post('/speaking/personalized', data, {
    timeout: 60000
  }),

  getPersonalizedLesson: (sessionId) => axiosClient.get(`/speaking/personalized/${sessionId}`)
};
