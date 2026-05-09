import axiosClient from './axiosClient';

export const grammarApi = {
  getCategories: () => axiosClient.get('/grammar/categories'),
  getTopicsByCategory: (categoryId) => axiosClient.get(`/grammar/categories/${categoryId}/topics`),
  getTopicDetail: (topicId) => axiosClient.get(`/grammar/topics/${topicId}`)
};
