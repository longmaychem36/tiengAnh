import axiosClient from './axiosClient';

export const speakingApi = {
  // Get all speaking lessons
  getLessons: () => axiosClient.get('/speaking/lessons'),
  
  // Get lesson details (sentences)
  getLessonDetails: (id) => axiosClient.get(`/speaking/lessons/${id}`),
  
  // Transcribe audio using Whisper (legacy - kept for compatibility)
  transcribeAudio: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return axiosClient.post('/speaking/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    });
  },

  // Combined transcribe + analyze in one request (FAST - saves 1 round-trip)
  transcribeAndAnalyze: (audioBlob, targetTexts) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('targetTexts', JSON.stringify(targetTexts));
    return axiosClient.post('/speaking/transcribe-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    });
  },
  
  // Analyze transcript against target texts (legacy - kept for compatibility)
  analyzeText: (data) => axiosClient.post('/speaking/analyze', data),
  
  // Save progress
  saveProgress: (data) => axiosClient.post('/speaking/progress', data)
};
