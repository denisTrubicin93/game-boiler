const axios = require('axios');

const addContent = (content: any) => {
  const json = JSON.stringify(content);
  console.log('addContent: ', json);
  const config = {
    baseURL: process.env.SUKOYAKA_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
  };
  return axios.post('/digital-avatar/contents/detail', json, config);
};

export { addContent };
