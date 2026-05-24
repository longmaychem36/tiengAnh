import axiosClient from './axiosClient';

export const receptiveApi = {
  getLessons: (skill) => axiosClient.get(`/${skill}/lessons`),
  getLessonDetails: (skill, id) => axiosClient.get(`/${skill}/lessons/${id}`),
  saveProgress: (skill, data) => axiosClient.post(`/${skill}/progress`, data)
};
