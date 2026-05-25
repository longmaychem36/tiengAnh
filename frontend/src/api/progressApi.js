import axiosClient from './axiosClient';

export const gamificationApi = {
  getStats: () => axiosClient.get('/gamification/stats'),
  addExp: (amount, reason) => axiosClient.post('/gamification/exp', { amount, reason }),
  getAllAchievements: () => axiosClient.get('/gamification/achievements'),
  getMyAchievements: () => axiosClient.get('/gamification/achievements/my')
};
