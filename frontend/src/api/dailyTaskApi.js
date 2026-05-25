import axiosClient from './axiosClient';

export const dailyTaskApi = {
  getToday: () => axiosClient.get('/daily-tasks/today'),
  complete: (taskId) => axiosClient.post(`/daily-tasks/${taskId}/complete`),
  getWeaknesses: (limit = 10) => axiosClient.get('/daily-tasks/weaknesses', {
    params: { limit }
  })
};
