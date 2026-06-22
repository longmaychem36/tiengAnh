import axiosClient from './axiosClient';

export const onboardingApi = {
  getStatus: () => axiosClient.get('/onboarding/status'),
  submitSurvey: (answer) => axiosClient.post('/onboarding/survey', { answer }),
  startTest: () => axiosClient.post('/onboarding/test-attempts'),
  checkAnswer: (attemptToken, questionId, answer) => axiosClient.post('/onboarding/test-attempts/check', { attemptToken, questionId, answer }),
  submitTest: (attemptToken, answers) => axiosClient.post('/onboarding/test-attempts/submit', { attemptToken, answers })
};
