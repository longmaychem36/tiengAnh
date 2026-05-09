import axiosClient from './axiosClient';

export const speakingApi = {
  // Get all speaking lessons
  getLessons: () => axiosClient.get('/speaking/lessons'),
  
  // Get lesson details (sentences)
  getLessonDetails: (id) => axiosClient.get(`/speaking/lessons/${id}`),
  
  // Analyze text
  analyzeText: (data) => axiosClient.post('/speaking/analyze', data),
  
  // Save progress
  saveProgress: (data) => axiosClient.post('/speaking/progress', data)
};
