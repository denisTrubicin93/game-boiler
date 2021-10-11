const axios = require('axios');

const CompatibilityService = (color1: string, color2: string) => {
  return axios.get('/apigw/mirror/contentspocket/color-test/1', {
    baseURL: process.env.API_BASE_URL,
    params: {
      color1,
      color2,
    },
    timeout: 8000,
    'Content-Type': 'application/xml; charset=utf-8',
    headers: {
      apiKey: 'dgVbeYHLlJZIhq4RsX0nEpg0w4twvTmf',
    },
  });
};

export default CompatibilityService;
