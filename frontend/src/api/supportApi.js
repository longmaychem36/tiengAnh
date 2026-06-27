import axiosClient from './axiosClient';

export const supportApi = {
  getMyTickets: () => axiosClient.get('/support/tickets'),
  getMyTicket: (id) => axiosClient.get(`/support/tickets/${id}`),
  createTicket: ({ email, title, description, category, attachment }) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (attachment) formData.append('attachment', attachment);

    return axiosClient.post('/support/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000
    });
  },
  addMessage: (ticketId, { message, attachment }) => {
    const formData = new FormData();
    formData.append('message', message);
    if (attachment) formData.append('attachment', attachment);

    return axiosClient.post(`/support/tickets/${ticketId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 45000
    });
  }
};

export const adminSupportApi = {
  getTickets: (params) => axiosClient.get('/admin/support/tickets', { params }),
  getTicket: (id) => axiosClient.get(`/admin/support/tickets/${id}`),
  respond: (id, data) => axiosClient.put(`/admin/support/tickets/${id}/respond`, data),
  updateStatus: (id, status) => axiosClient.put(`/admin/support/tickets/${id}/status`, { status })
};
