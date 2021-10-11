const axios = require('axios');

const insuranceAnalytics = (data: any, deviceId: any) => {
  const json = JSON.stringify(data);
  console.log('insuranceAnalytics: ', json);
  const config = {
    baseURL: process.env.API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 8000,
  };
  return axios.post(`/mirror/analytics/user/${deviceId}`, json, config);
};

export { insuranceAnalytics };
