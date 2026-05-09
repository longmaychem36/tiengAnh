import axiosClient from './axiosClient';

export const writingApi = {
  getLessons: () => axiosClient.get('/writing/lessons'),
  getLessonDetails: (id) => axiosClient.get(`/writing/lessons/${id}`),
  checkWriting: (data) => axiosClient.post('/writing/check', data),
  saveProgress: (data) => axiosClient.post('/writing/progress', data)
};
