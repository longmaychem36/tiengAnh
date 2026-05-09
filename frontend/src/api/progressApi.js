import axiosClient from './axiosClient';

export const progressApi = {
  getOverall: () => axiosClient.get('/progress'),
  updateLesson: (data) => axiosClient.post('/progress/lesson', data),
  getByCourse: (courseId) => axiosClient.get(`/progress/course/${courseId}`)
};

export const gamificationApi = {
  getStats: () => axiosClient.get('/gamification/stats'),
  addExp: (amount, reason) => axiosClient.post('/gamification/exp', { amount, reason }),
  getAllAchievements: () => axiosClient.get('/gamification/achievements'),
  getMyAchievements: () => axiosClient.get('/gamification/achievements/my')
};
