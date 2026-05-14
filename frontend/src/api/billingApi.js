import axiosClient from './axiosClient';

export const billingApi = {
  getSubscription: () => axiosClient.get('/billing/subscription'),
  createPlusOrder: () => axiosClient.post('/billing/plus/orders'),
  getPlusOrderStatus: (id) => axiosClient.get(`/billing/plus/orders/${id}`)
};
