const axios = require('axios');

const getQuizLibrary = () => {
  return axios.get('/mirror/quiz', {
    baseURL: process.env.API_BASE_URL,
    timeout: 3000,
  });
};

const getChildQuizLibrary = () => {
  return axios.get('/mirror/quiz/child', {
    baseURL: process.env.API_BASE_URL,
    timeout: 3000,
  });
};

const getChildQuizLibraryByAgeType = (ageType: number) => {
  return axios.get(`/mirror/quiz/child/type/${ageType}`, {
    baseURL: process.env.API_BASE_URL,
    timeout: 3000,
  });
};

export { getQuizLibrary, getChildQuizLibrary, getChildQuizLibraryByAgeType };
