import axiosClient from './axiosClient';

export const speakingApi = {
  // Get all speaking lessons
  getLessons: () => axiosClient.get('/speaking/lessons'),
  
  // Get lesson details (sentences)
  getLessonDetails: (id) => axiosClient.get(`/speaking/lessons/${id}`),
  
  // Transcribe audio using Whisper
  transcribeAudio: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return axiosClient.post('/speaking/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000 // 30s timeout for Whisper processing
    });
  },
  
  // Analyze transcript against target texts
  analyzeText: (data) => axiosClient.post('/speaking/analyze', data),
  
  // Save progress
  saveProgress: (data) => axiosClient.post('/speaking/progress', data)
};
