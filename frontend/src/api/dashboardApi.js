import axiosClient from './axiosClient';

export const dashboardApi = {
  getOverview: () => axiosClient.get('/dashboard/overview')
};
