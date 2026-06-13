import axiosClient from './axiosClient';

export const onboardingApi = {
  getStatus: () => axiosClient.get('/onboarding/status'),
  submitSurvey: (answer) => axiosClient.post('/onboarding/survey', { answer }),
  startTest: () => axiosClient.post('/onboarding/test-attempts'),
  submitTest: (attemptId, answers) => axiosClient.post(`/onboarding/test-attempts/${attemptId}/submit`, { answers })
};
